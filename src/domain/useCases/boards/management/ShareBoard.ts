import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { ISharedUsers } from "@/domain/entities/IBoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/interfaces/IBoardRepository";

class ShareBoardError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function shareBoardWithUser(
  boardId: string,
  sharedUserData: ISharedUsers,
  board: IBoardEntity,
  boardRepository: IBoardRepository
): Promise<IBoardEntity> {
  try {
    board.sharedUsers!.push(sharedUserData);
    const sharedBoard = await boardRepository.update(boardId, board);
    if (!sharedBoard) {
      throw new ShareBoardError(
        `Unable to share board with user: ${sharedUserData.userId}`
      );
    }

    return sharedBoard;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new ShareBoardError(`Error sharing board: ${error.message}`);
    }
  }
}
