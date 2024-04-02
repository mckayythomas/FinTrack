import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { UserRepository } from "@/infrastructure/adapters/repositories/UserRepository";
import { shareBoardWithUserSchema } from "@/app/api/_validation/board.schema";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { shareBoardWithUser } from "@/domain/useCases/boards/management/ShareBoard";
import { getUserByInfo } from "@/domain/useCases/users/getUserByInfo";
import { auth } from "@/infrastructure/auth/nextAuth";

const boardRepository = new BoardRepository();
const userRepository = new UserRepository();

// GET all shared users
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } },
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
    if (userBoard.userId !== userId) {
      return NextResponse.json(
        { error: "User for board not logged in." },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error(`Error getting shared users for board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

// PATCH Share board with user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { boardId: string } },
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
    if (userBoard.userId !== userId) {
      return NextResponse.json(
        { error: "User for board not logged in." },
        { status: 401 },
      );
    }

    const data = await request.json();

    // Validate user data
    const sharingBoardWithUserData = shareBoardWithUserSchema.safeParse(data);
    if (!sharingBoardWithUserData.success) {
      const errorMessages: string[] = [];
      console.log(sharingBoardWithUserData.error);
      sharingBoardWithUserData.error.issues.forEach((issue: any) => {
        const message = `Field: ${issue.path[0] || "unknown"} - ${
          issue.message
        }`;
        errorMessages.push(message);
      });
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: errorMessages,
        },
        { status: 400 },
      );
    }

    // Get user data by email or by name
    const user = await getUserByInfo(
      sharingBoardWithUserData.data,
      userRepository,
    );
    const sharedUserId = user._id;
    const accessLevel = sharingBoardWithUserData.data.accessLevel;
    const addedUserData = {
      userId: sharedUserId,
      accessLevel: accessLevel,
    };
    const boardToShare = await getBoardById(boardId, boardRepository);
    if (
      boardToShare.sharedUsers &&
      boardToShare.sharedUsers.find(
        (user) => user.userId === addedUserData.userId,
      )
    ) {
      return NextResponse.json(
        { message: "Board already shared with user." },
        { status: 400 },
      );
    }
    if (
      boardToShare.privacy === "private" &&
      boardToShare.sharedUsers?.length === 0
    ) {
      boardToShare.privacy = "shared";
    }

    const board = await shareBoardWithUser(
      boardId,
      addedUserData,
      boardToShare,
      boardRepository,
    );
    return NextResponse.json({ board }, { status: 200 });
  } catch (error: any) {
    console.error(`Error sharing board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
