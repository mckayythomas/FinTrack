import { NextRequest, NextResponse } from "next/server";
import { BoardRepository } from "@/infrastructure/adapters/repositories/BoardRepository";
import { UserRepository } from "@/infrastructure/adapters/repositories/UserRepository";
import { unshareBoardWithUserSchema } from "@/app/api/_validation/board.schema";
import { getBoardById } from "@/domain/useCases/boards/data/GetBoardById";
import { unshareBoardWithUser } from "@/domain/useCases/boards/management/UnshareBoard";
import { getUserByInfo } from "@/domain/useCases/users/getUserByInfo";

const boardRepository = new BoardRepository();
const userRepository = new UserRepository();

// PATCH remove user from shared board
export async function PATCH(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    // Authorize user
    const boardId = params.boardId;
    const data = request.json();

    // Validate user data
    const unsharingBoardWithUserData =
      unshareBoardWithUserSchema.safeParse(data);
    if (!unsharingBoardWithUserData.success) {
      const errorMessages: string[] = [];
      unsharingBoardWithUserData.error.issues.forEach((issue: any) => {
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
      unsharingBoardWithUserData.data,
      userRepository
    );
    const userId = user._id;
    const boardToUnshare = await getBoardById(boardId, boardRepository);

    // Unshare board
    const board = await unshareBoardWithUser(
      boardId,
      userId,
      boardToUnshare,
      boardRepository
    );

    return NextResponse.json(
      {
        message: `Board unshared with user: ${
          unsharingBoardWithUserData.data.email ||
          unsharingBoardWithUserData.data.name
        }`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error unsharing board: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
