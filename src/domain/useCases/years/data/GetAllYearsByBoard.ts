import { YearRepositoryError } from "@/infrastructure/adapters/repositories/YearRepository";
import { IYearEntity } from "@/domain/entities/IYearEntity";
import { IYearRepository } from "@/infrastructure/adapters/interfaces/IYearRepository";

class GetYearsByBoardError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getYearsByBoard(
  boardId: string,
  yearRepository: IYearRepository
): Promise<IYearEntity[]> {
  try {
    const years = await yearRepository.findAllByBoardId(boardId);
    if (years.length === 0) {
      throw new GetYearsByBoardError(`No years found for boardId: ${boardId}`);
    }
    return years;
  } catch (error: any) {
    if (error instanceof YearRepositoryError) {
      throw error;
    } else {
      throw new GetYearsByBoardError(`Error getting years: ${error.message}`);
    }
  }
}
