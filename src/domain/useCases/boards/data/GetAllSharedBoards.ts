import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { IBoardRepository } from "@/infrastructure/adapters/interfaces/IBoardRepository";

class GetAllSharedBoardsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getAllSharedBoards(
  userId: string,
  boardRepository: IBoardRepository
): Promise<IBoardEntity[]> {
  try {
    const sharedBoards = await boardRepository.findAllSharedBoards(userId);
    return sharedBoards;
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new GetAllSharedBoardsError(
        `Error getting shared boards: ${error.message}`
      );
    }
  }
}
