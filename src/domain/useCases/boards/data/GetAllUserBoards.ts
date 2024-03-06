import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/BoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/IBoardRepository";

class GetBoardsByUserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getBoardsByUser(
  userId: string,
  boardRepository: IBoardRepository
): Promise<IBoardEntity[]> {
  try {
    const userBoards = await boardRepository.findAllByUserId(userId);
    if (userBoards.length === 0) {
      throw new GetBoardsByUserError(`No boards found for userId: ${userId}`);
    }
    return userBoards;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new GetBoardsByUserError(
        `Error getting user boards: ${error.message}`
      );
    }
  }
}
