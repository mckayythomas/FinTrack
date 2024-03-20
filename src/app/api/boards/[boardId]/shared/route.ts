import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { UserRepository } from "@/infrastructure/adapters/repositories/UserRepository";
import { shareBoardWithUserSchema } from "@/app/api/_validation/board.schema";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { shareBoardWithUser } from "@/domain/useCases/boards/management/ShareBoard";
import { getUserByInfo } from "@/domain/useCases/users/getUserByInfo";
import { getUserById } from "@/domain/useCases/users/getUserById";

const boardRepository = new BoardRepository();
const userRepository = new UserRepository();

// GET all shared users
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    // Authenticate user
    const boardId = params.boardId;

    // get boards shared users
    const board = await getBoardById(boardId, boardRepository);
    const sharedUsersData = board.sharedUsers;
    if (sharedUsersData!.length === 0 || !sharedUsersData) {
      return NextResponse.json(
        { message: "No shared users found for board" },
        { status: 404 }
      );
    }

    const users: any[] = [];
    sharedUsersData.forEach(async (sharedUserData) => {
      const sharedUser = await getUserById(
        sharedUserData.userId,
        userRepository
      );
      users.push(sharedUser);
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting shared users for board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// PATCH Share board with user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    // Authorize user
    const boardId = params.boardId;
    const data = request.json();

    // Validate user data
    const sharingBoardWithUserData = shareBoardWithUserSchema.safeParse(data);
    if (!sharingBoardWithUserData.success) {
      const errorMessages: string[] = [];
      sharingBoardWithUserData.error.issues.forEach((issue: any) => {
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

    // Get user data by email or by name
    const user = await getUserByInfo(
      sharingBoardWithUserData.data,
      userRepository
    );
    const userId = user._id;
    const accessLevel = sharingBoardWithUserData.data.accessLevel;
    const addedUserData = {
      userId: userId,
      accessLevel: accessLevel,
    };
    const boardToShare = await getBoardById(boardId, boardRepository);
    const board = await shareBoardWithUser(
      boardId,
      addedUserData,
      boardToShare,
      boardRepository
    );
    return NextResponse.json(
      {
        message: `Board shared with user: ${
          sharingBoardWithUserData.data.email ||
          sharingBoardWithUserData.data.name
        }`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error sharing board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
