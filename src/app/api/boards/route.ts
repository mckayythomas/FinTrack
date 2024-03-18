import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { createBoardSchema } from "@/app/api/_validation/board.schema";
import { createBoard } from "@/domain/useCases/boards/creation/CreateBoard";
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
        { message: "No boards found for the user." },
        { status: 404 }
      );
    }

    return NextResponse.json({ boards }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting boards: ${error}`);
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
    const userId = "65d42496da86f15e38611ede";

    // User input validated as valid board data
    const boardData = createBoardSchema.safeParse(data);
    if (!boardData.success) {
      const errorMessages: string[] = [];
      boardData.error.issues.forEach((issue) => {
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

    const newBoardData = {
      userId: userId,
      name: boardData.data.name,
      description: boardData.data.description,
      privacy: boardData.data.privacy,
    };

    const board = await createBoard(newBoardData, boardRepository);

    return NextResponse.json({ board }, { status: 201 });
  } catch (error: any) {
    console.error(`Error creating board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
