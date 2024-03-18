import { NextRequest, NextResponse } from "next/server";

import { TransactionRepository } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { YearRepository } from "@/infrastructure/adapters/repositories/YearRepository";

import { getTransactionById } from "@/domain/useCases/transactions/data/GetTransactionById";
import { updateTransaction } from "@/domain/useCases/transactions/management/UpdateTransaction";
import { deleteTransaction } from "@/domain/useCases/transactions/management/DeleteTransaction";
import { getTransactionsByMonth } from "@/domain/useCases/transactions/data/GetTransactionsByMonth";
import { aggregateTransactions } from "@/domain/useCases/transactions/data/AggregateTransactions";

import { getMonthsByYear } from "@/domain/useCases/months/data/GetMonthsByYear";
import { getMonthById } from "@/domain/useCases/months/data/GetMonthById";
import { createMonth } from "@/domain/useCases/months/creation/CreateMonth";
import { deleteMonth } from "@/domain/useCases/months/management/DeleteMonth";

import { getYearsByBoard } from "@/domain/useCases/years/data/GetAllYearsByBoard";
import { createYear } from "@/domain/useCases/years/creation/CreateYear";
import { deleteYear } from "@/domain/useCases/years/management/DeleteYear";

import { updateTransactionSchema } from "@/app/api/_validation/transaction.schema";
import { IMonthEntity } from "@/domain/entities/IMonthEntity";

const transactionRepository = new TransactionRepository();
const monthRepository = new MonthRepository();
const yearRepository = new YearRepository();

// GET retrieve individual transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; transactionId: string } }
) {
  try {
    // Authenticate user
    const transactionId = params.transactionId;
    const transaction = await getTransactionById(
      transactionId,
      transactionRepository
    );
    if (!transaction) {
      return NextResponse.json(
        { error: `No transaction found for transactionId: ${transactionId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting transaction: ${error}`);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// PATCH update transaction
export async function PATCH(
  request: NextRequest,
  { params }: { params: { boardId: string; transactionId: string } }
) {
  try {
    // Authenticate user
    const boardId = params.boardId;
    const transactionId = params.transactionId;
    const data = await request.json();

    // User input validated as valid transaction data
    const updateTransactionData = updateTransactionSchema.safeParse(data);
    if (!updateTransactionData.success) {
      const errorMessages: string[] = [];
      updateTransactionData.error.issues.forEach((issue) => {
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

    const oldTransaction = await getTransactionById(
      transactionId,
      transactionRepository
    );

    const updateTransactionDate = new Date(updateTransactionData.data.date);
    const updateTransactionDateUnix = Math.floor(
      updateTransactionDate.getTime() / 1000
    );

    // Init month to be able to change later
    let month: IMonthEntity | undefined = await getMonthById(
      oldTransaction.monthId,
      monthRepository
    );

    // Create year for and year as needed
    const transactionYear = updateTransactionDate.getUTCFullYear();
    const transactionMonth = updateTransactionDate.getUTCMonth() + 1;
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
    month = months.find((month) => month.month === transactionMonth);
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

    // Set transaction data
    const updatedTransactionData = {
      monthId: month._id,
      name: updateTransactionData.data.name,
      type: updateTransactionData.data.type,
      amount: updateTransactionData.data.amount,
      date: updateTransactionDateUnix,
      location: updateTransactionData.data.location,
      description: updateTransactionData.data.description,
      category: updateTransactionData.data.category,
      customCategory:
        updateTransactionData.data.customCategory === null
          ? undefined
          : updateTransactionData.data.customCategory,
    };

    const transaction = await updateTransaction(
      transactionId,
      updatedTransactionData,
      transactionRepository
    );

    // Check if date is changed
    if (oldTransaction.date !== updateTransactionDateUnix) {
      // If date changes then check for old months existence with more transactions
      const oldMonthId = oldTransaction.monthId;
      const oldMonth = await getMonthById(oldMonthId, monthRepository);
      const oldYearId = oldMonth.yearId;

      const transactionsForMonth = await getTransactionsByMonth(
        oldMonthId,
        transactionRepository
      );
      if (transactionsForMonth.length === 0) {
        await deleteMonth(oldMonthId, monthRepository);
        const monthForYears = await getMonthsByYear(oldYearId, monthRepository);
        // check if month exists for year
        if (monthForYears.length === 0) {
          await deleteYear(oldYearId, yearRepository);
          return NextResponse.json({ status: 204 });
        }
      }
    }

    await aggregateTransactions(
      transaction.monthId,
      month.yearId,
      transactionRepository,
      monthRepository,
      yearRepository
    );

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating transaction: ${error}`);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// DELETE delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { boardId: string; transactionId: string } }
) {
  try {
    // Authenticate user
    const transactionId = params.transactionId;

    // Retrieve transaction
    const transaction = await getTransactionById(
      transactionId,
      transactionRepository
    );
    if (!transaction) {
      return NextResponse.json(
        { message: `Transaction with Id: ${transactionId} not found.` },
        { status: 404 }
      );
    }

    // delete transaction
    await deleteTransaction(transactionId, transactionRepository);

    // get MonthId and year Id
    const monthId = transaction.monthId;
    const month = await getMonthById(monthId, monthRepository);
    const yearId = month.yearId;

    // check if any transactions exist for month
    const transactionsForMonth = await getTransactionsByMonth(
      monthId,
      transactionRepository
    );
    if (transactionsForMonth.length === 0) {
      await deleteMonth(monthId, monthRepository);
      const monthForYears = await getMonthsByYear(yearId, monthRepository);
      // check if month exists for year
      if (monthForYears.length === 0) {
        await deleteYear(yearId, yearRepository);
        return NextResponse.json({ status: 204 });
      }
    }

    await aggregateTransactions(
      monthId,
      yearId,
      transactionRepository,
      monthRepository,
      yearRepository
    );

    return NextResponse.json({ status: 204 });
  } catch (error: any) {
    console.error(`Error deleting transaction: ${error}`);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
