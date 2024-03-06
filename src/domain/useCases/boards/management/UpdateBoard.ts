import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/BoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/IBoardRepository";

class UpdateBoardError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function updateBoard(
  boardId: string,
  board: Partial<IBoardEntity>,
  boardRepository: IBoardRepository
): Promise<IBoardEntity> {
  try {
    const updatedBoard = await boardRepository.update(boardId, board);
    if (!updatedBoard) {
      throw new UpdateBoardError(
        `Unable to update board data for board: ${boardId}`
      );
    }
    return updatedBoard;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new UpdateBoardError(`Error updating board: ${error.message}`);
    }
  }
}
