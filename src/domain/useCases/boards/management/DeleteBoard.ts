import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { IBoardRepository } from "@/infrastructure/adapters/IBoardRepository";

class DeleteBoardError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function deleteBoard(
  boardId: string,
  boardRepository: IBoardRepository
): Promise<void> {
  try {
    await boardRepository.delete(boardId);
  } catch (error: any) {
    if (error instanceof BoardRepositoryError) {
      throw error;
    } else {
      throw new DeleteBoardError(`Error deleting board: ${error.message}`);
    }
  }
}
