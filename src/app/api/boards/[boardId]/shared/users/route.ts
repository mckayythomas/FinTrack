import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { UserRepository } from "@/infrastructure/adapters/repositories/UserRepository";
import { getUserById } from "@/domain/useCases/users/getUserById";
import { auth } from "@/infrastructure/auth/nextAuth";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { sharedUsersSchema } from "@/app/api/_validation/user.schema";
import { IUserEntity } from "@/domain/entities/IUserEntity";

interface ISharedUsers extends IUserEntity {
  accessLevel: "view-only" | "contributor";
}

const boardRepository = new BoardRepository();
const userRepository = new UserRepository();
// GET shared users get user from ID
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
    const boardId = params.boardId;

    // Get board to validate userId's are part of shared board
    const board = await getBoardById(boardId, boardRepository);
    const boardSharedUsers = board.sharedUsers;
    if (!boardSharedUsers || boardSharedUsers.length === 0) {
      return NextResponse.json(
        { error: "Board has no shared users" },
        { status: 400 },
      );
    }

    const sharedUsersIds = board.sharedUsers!.map((user) => user.userId);
    const users: ISharedUsers[] = await Promise.all(
      sharedUsersIds.map(async (userId) => {
        const user = await getUserById(userId, userRepository);
        const accessLevel = board.sharedUsers!.find(
          (sharedUser) => sharedUser.userId === userId,
        )?.accessLevel;
        if (user) {
          return { ...user, accessLevel } as ISharedUsers;
        } else {
          throw new Error(`User with ID ${userId} not found`);
        }
      }),
    );

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting user: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
