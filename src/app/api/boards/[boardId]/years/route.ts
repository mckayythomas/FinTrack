import { NextRequest, NextResponse } from "next/server";
import { YearRepository } from "@/infrastructure/adapters/repositories/YearRepository";
import { getYearsByBoard } from "@/domain/useCases/years/data/GetAllYearsByBoard";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { auth } from "@/infrastructure/auth/nextAuth";

const yearRepository = new YearRepository();
const boardRepository = new BoardRepository();

// GET retrieve all years
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } },
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

    const years = await getYearsByBoard(boardId, yearRepository);

    return NextResponse.json({ years }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting years: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
