import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/interfaces/IBoardRepository";

class UnshareBoardError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function unshareBoardWithUser(
  boardId: string,
  unshareUserId: string,
  board: IBoardEntity,
  boardRepository: IBoardRepository
): Promise<IBoardEntity> {
  try {
    if (board.sharedUsers?.length === 0 || !board.sharedUsers) {
      throw new UnshareBoardError("Board is not shared with any user");
    }
    const sharedUserData = board.sharedUsers.filter((sharedUser) => {
      sharedUser.userId !== unshareUserId;
    });

    board.sharedUsers = sharedUserData;
    const unsharedBoard = await boardRepository.update(boardId, board);
    if (!unsharedBoard) {
      throw new UnshareBoardError(
        `Unable to remove user: ${unshareUserId} from shared board.`
      );
    }

    return unsharedBoard;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new UnshareBoardError(
        `Error removing user from shared board: ${error.message}`
      );
    }
  }
}
