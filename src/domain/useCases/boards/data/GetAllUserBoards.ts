import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/interfaces/IBoardRepository";

class GetBoardsByUserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getBoardsByUser(
  userId: string,
  boardRepository: IBoardRepository,
): Promise<IBoardEntity[]> {
  try {
    const userBoards = await boardRepository.findAllByUserId(userId);
    return userBoards;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new GetBoardsByUserError(
        `Error getting user boards: ${error.message}`,
      );
    }
  }
}
