import { NextRequest, NextResponse } from "next/server";
import { TransactionRepository } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { getTransactionsByMonth } from "@/domain/useCases/transactions/data/GetTransactionsByMonth";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { auth } from "@/infrastructure/auth/nextAuth";

const transactionRepository = new TransactionRepository();
const boardRepository = new BoardRepository();

// GET retrieve all transactions
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; monthId: string } },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 },
      );
    }
    const userId = session.user.id;
    const boardId = params.boardId;

    // Validate user owns board
    const userBoard = await getBoardById(boardId, boardRepository);
    if (
      userBoard.userId !== session.user.id &&
      userBoard.sharedUsers?.find((user) => user.userId !== session.user?.id)
        ?.userId
    ) {
      return NextResponse.json(
        { error: "User for board not logged in." },
        { status: 401 },
      );
    }
    const monthId = params.monthId;
    const transactions = await getTransactionsByMonth(
      monthId,
      transactionRepository,
    );
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting transactions: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
