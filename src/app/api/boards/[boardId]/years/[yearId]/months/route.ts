import { NextRequest, NextResponse } from "next/server";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { getMonthsByYear } from "@/domain/useCases/months/data/GetMonthsByYear";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { auth } from "@/infrastructure/auth/nextAuth";

const monthRepository = new MonthRepository();
const boardRepository = new BoardRepository();

// GET retrieve all months by year id
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; yearId: string } },
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
    const yearId = params.yearId;
    const months = await getMonthsByYear(yearId, monthRepository);

    return NextResponse.json({ months }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting months: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 },
    );
  }
}
