import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { updateBoardSchema } from "@/app/api/_validation/board.schema";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { updateBoard } from "@/domain/useCases/boards/management/UpdateBoard";
import { deleteBoard } from "@/domain/useCases/boards/management/DeleteBoard";

const boardRepository = new BoardRepository();

// GET single board by id
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    // Authenticate user
    const boardId = params.boardId;
    const board = await getBoardById(boardId, boardRepository);
    if (!board) {
      return NextResponse.json(
        { error: `No board found for boardId: ${boardId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ board }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// PATCH update single board name and description by id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    // Authenticate user
    const boardId = params.boardId;
    const data = await request.json();

    // User input validated as valid board data
    const updateBoardData = updateBoardSchema.safeParse(data);
    if (!updateBoardData.success) {
      const errorMessages: string[] = [];
      updateBoardData.error.issues.forEach((issue) => {
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

    const board = await updateBoard(
      boardId,
      updateBoardData.data,
      boardRepository
    );

    return NextResponse.json({ board }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// DELETE delete single board by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    // Authenticate user
    const boardId = params.boardId;
    await deleteBoard(boardId, boardRepository);
    return NextResponse.json(
      { message: "Board deleted successfully" },
      { status: 204 }
    );
  } catch (error: any) {
    console.error(`Error deleting board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
