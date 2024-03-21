import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { YearRepository } from "@/infrastructure/adapters/repositories/YearRepository";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { TransactionRepository } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { getYearsByBoard } from "@/domain/useCases/years/data/GetAllYearsByBoard";
import { createYear } from "@/domain/useCases/years/creation/CreateYear";
import { getMonthsByYear } from "@/domain/useCases/months/data/GetMonthsByYear";
import { createMonth } from "@/domain/useCases/months/creation/CreateMonth";
import { createTransaction } from "@/domain/useCases/transactions/creation/CreateTransaction";
import { aggregateTransactions } from "@/domain/useCases/transactions/data/AggregateTransactions";
import { createTransactionSchema } from "@/app/api/_validation/transaction.schema";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";

const transactionRepository = new TransactionRepository();
const boardRepository = new BoardRepository();
const yearRepository = new YearRepository();
const monthRepository = new MonthRepository();

// POST create new transaction
export async function POST(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const boardId = params.boardId;

    // Validate user owns board
    const userBoard = await getBoardById(boardId, boardRepository);
    if (userBoard.userId !== userId) {
      return NextResponse.json(
        { error: "User for board not logged in." },
        { status: 401 }
      );
    }

    const data = await request.json();

    const transactionData = createTransactionSchema.safeParse(data);
    if (!transactionData.success) {
      const errorMessages: string[] = [];
      transactionData.error.issues.forEach((issue) => {
        const message = `Field: ${issue.path[0]} - ${issue.message}`;
        errorMessages.push(message);
      });
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: errorMessages,
        },
        { status: 400 }
      );
    }

    // Check if year exists and create.
    const transactionDate = new Date(transactionData.data.date);
    const transactionYear = transactionDate.getUTCFullYear();
    const transactionMonth = transactionDate.getUTCMonth() + 1;
    const years = await getYearsByBoard(boardId, yearRepository);
    let year = years.find((year) => year.year === transactionYear);
    if (!year) {
      const newYearData = {
        boardId: boardId,
        year: transactionYear,
      };
      year = await createYear(newYearData, yearRepository);
      if (!year) {
        throw new Error();
      }
    }

    // check if month exists and create month as needed
    const yearId = year._id!;
    const months = await getMonthsByYear(yearId, monthRepository);
    let month = months.find((month) => month.month === transactionMonth);
    if (!month) {
      const newMonthData = {
        yearId: yearId,
        month: transactionMonth,
      };
      month = await createMonth(newMonthData, monthRepository);
      if (!month) {
        throw new Error();
      }
    }

    // Create transaction details
    const monthId = month._id!;
    const transactionDateUnix = Math.floor(transactionDate.getTime() / 1000);
    const newTransactionData = {
      monthId: monthId,
      name: transactionData.data.name,
      type: transactionData.data.type,
      amount: transactionData.data.amount,
      date: transactionDateUnix,
      location: transactionData.data.location,
      category: transactionData.data.category,
      customCategory:
        transactionData.data.customCategory === null
          ? undefined
          : transactionData.data.customCategory,
    };

    const transaction = await createTransaction(
      newTransactionData,
      transactionRepository
    );

    // Aggregate transactions
    aggregateTransactions(
      monthId,
      yearId,
      transactionRepository,
      monthRepository,
      yearRepository
    );

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error: any) {
    console.error(`Error creating transaction: \n${error.message}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
