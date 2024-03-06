import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { createBoardSchema } from "@/domain/entities/board.schema";
import { createBoard } from "@/domain/useCases/boards/creation/createBoard";
import { getBoardsByUser } from "@/domain/useCases/boards/data/GetAllUserBoards";

const boardRepository = new BoardRepository();

// GET get all boards by user id
export async function GET() {
  try {
    // Change to session data and authenticate user
    const userId = "65d42496da86f15e38611ede";
    const boards = await getBoardsByUser(userId, boardRepository);
    if (boards.length === 0) {
      return NextResponse.json(
        { message: "No boards found for the user" },
        { status: 200 }
      );
    }

    return NextResponse.json({ boards }, { status: 200 });
  } catch (error: any) {
    console.error("Error getting boards: ", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// POST create board
export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const data = await request.json();

    // User input validated as valid board data
    const boardData = createBoardSchema.safeParse(data);
    if (!boardData.success) {
      return NextResponse.json(
        { error: `Invalid request data: ${boardData.error}` },
        { status: 400 }
      );
    }

    const newBoard = await createBoard(boardData.data, boardRepository);

    return NextResponse.json({ newBoard }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating board: ", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
