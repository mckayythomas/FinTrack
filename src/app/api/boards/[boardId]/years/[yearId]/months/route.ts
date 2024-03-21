import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { getMonthsByYear } from "@/domain/useCases/months/data/GetMonthsByYear";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";

const monthRepository = new MonthRepository();
const boardRepository = new BoardRepository();

// GET retrieve all months by year id
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; yearId: string } }
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
    const yearId = params.yearId;
    const months = await getMonthsByYear(yearId, monthRepository);
    if (!months) {
      return NextResponse.json(
        { error: `No months found for yearId: ${yearId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ months }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting months: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
