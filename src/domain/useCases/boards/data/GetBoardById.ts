import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/interfaces/IBoardRepository";

class GetBoardByIdError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getBoardById(
  boardId: string,
  boardRepository: IBoardRepository
): Promise<IBoardEntity> {
  try {
    const board = await boardRepository.findOneById(boardId);
    if (!board) {
      throw new GetBoardByIdError(
        `Unable to find board with boardId: ${boardId}`
      );
    }
    return board;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new GetBoardByIdError(`Error finding board: ${error.message}`);
    }
  }
}
