import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { getMonthById } from "@/domain/useCases/months/data/GetMonthById";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";

const monthRepository = new MonthRepository();
const boardRepository = new BoardRepository();

// GET retrieve single month
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; monthId: string } }
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
    const monthId = params.monthId;
    const month = await getMonthById(monthId, monthRepository);
    if (!month) {
      return NextResponse.json(
        { error: `No board found for boardId: ${monthId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ month }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting month: ${error}`);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
