import { NextRequest, NextResponse } from "next/server";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { getMonthById } from "@/domain/useCases/months/data/GetMonthById";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { auth } from "@/infrastructure/auth/nextAuth";

const monthRepository = new MonthRepository();
const boardRepository = new BoardRepository();

// GET retrieve single month
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; monthId: string } },
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
    const monthId = params.monthId;
    const month = await getMonthById(monthId, monthRepository);
    if (!month) {
      return NextResponse.json(
        { error: `No month found for monthId: ${monthId}` },
        { status: 404 },
      );
    }

    return NextResponse.json({ month }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting month: ${error}`);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
