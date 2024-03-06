import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/BoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/IBoardRepository";

class CreateBoardError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function createBoard(
  board: IBoardEntity,
  boardRepository: IBoardRepository
): Promise<IBoardEntity> {
  try {
    const createdBoard = await boardRepository.create(board);
    if (!createBoard) {
      throw new CreateBoardError(`Unable to create board: ${board}`);
    }
    return createdBoard;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new CreateBoardError(`Error creating board: ${error.message}`);
    }
  }
}
