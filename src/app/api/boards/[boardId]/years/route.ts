import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { YearRepository } from "@/infrastructure/adapters/repositories/YearRepository";
import { getYearsByBoard } from "@/domain/useCases/years/data/GetAllYearsByBoard";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const yearRepository = new YearRepository();
const boardRepository = new BoardRepository();

// GET retrieve all years
export async function GET(
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

    const years = await getYearsByBoard(boardId, yearRepository);
    if (years.length === 0) {
      return NextResponse.json(
        { message: "No years found for the given board" },
        { status: 404 }
      );
    }

    return NextResponse.json({ years }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting years: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
