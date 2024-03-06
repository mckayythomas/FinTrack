import { NextRequest, NextResponse } from "next/server";
import {
  BoardRepository,
  BoardRepositoryError,
} from "@/infrastructure/adapters/repositories/BoardRepository";
import { updateBoardSchema } from "@/domain/entities/board.schema";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { updateBoard } from "@/domain/useCases/boards/management/UpdateBoard";
import { deleteBoard } from "@/domain/useCases/boards/management/DeleteBoard";

const boardRepository = new BoardRepository();

// GET single board by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const boardId = params.id;
    const board = await getBoardById(boardId, boardRepository);
    if (!board) {
      return NextResponse.json(
        { error: `No board found for boardId: ${boardId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ board }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting board: `, error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// PATCH update single board name and description by id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const boardId = params.id;
    const data = await request.json();

    // User input validated as valid board data
    const updateBoardData = updateBoardSchema.safeParse(data);
    if (!updateBoardData.success) {
      return NextResponse.json(
        { error: `Invalid request data: ${updateBoardData.error}` },
        { status: 400 }
      );
    }

    const updatedBoard = await updateBoard(
      boardId,
      updateBoardData.data,
      boardRepository
    );

    return NextResponse.json({ updatedBoard }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating board: ", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// DELETE delete single board by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const boardId = params.id;
    await deleteBoard(boardId, boardRepository);
    return NextResponse.json({ status: 204 });
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    } else {
      console.error("Error deleting board: ", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again later" },
        { status: 500 }
      );
    }
  }
}
