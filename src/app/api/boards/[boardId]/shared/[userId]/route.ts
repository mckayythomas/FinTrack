import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { getAllSharedBoards } from "@/domain/useCases/boards/data/GetAllSharedBoards";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";

const boardRepository = new BoardRepository();
// GET retrieve all shared bards for user Id
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; userId: string } }
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

    const sharedUserId = params.userId;
    const boards = await getAllSharedBoards(sharedUserId, boardRepository);
    if (boards.length === 0) {
      return NextResponse.json(
        { message: "No shared boards found for the user." },
        { status: 404 }
      );
    }
    return NextResponse.json({ boards }, { status: 200 });
  } catch (error: any) {
    console.error(`Error sharing board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
