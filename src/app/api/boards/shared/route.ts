import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { getAllSharedBoards } from "@/domain/useCases/boards/data/GetAllSharedBoards";
import { auth } from "@/infrastructure/auth/nextAuth";

const boardRepository = new BoardRepository();
// GET retrieve all shared bards for user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not logged in." },
        { status: 401 },
      );
    }

    const sharedUserId = session.user.id!;
    const boards = await getAllSharedBoards(sharedUserId, boardRepository);

    return NextResponse.json({ boards }, { status: 200 });
  } catch (error: any) {
    console.error(`Error sharing board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
