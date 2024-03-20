import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";

import { getAllSharedBoards } from "@/domain/useCases/boards/data/GetAllSharedBoards";

const boardRepository = new BoardRepository();
// GET retrieve all shared bards for user Id
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; userId: string } }
) {
  try {
    // Authorize user
    const userId = params.userId;
    const boards = await getAllSharedBoards(userId, boardRepository);
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
