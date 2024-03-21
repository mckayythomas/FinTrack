import { YearRepositoryError } from "@/infrastructure/adapters/repositories/YearRepository";
import { IYearRepository } from "@/infrastructure/adapters/interfaces/IYearRepository";

class DeleteYearError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function deleteYear(
  yearId: string,
  yearRepository: IYearRepository
): Promise<void> {
  try {
    await yearRepository.delete(yearId);
  } catch (error: any) {
    if (error instanceof YearRepositoryError) {
      throw error;
    } else {
      throw new DeleteYearError(`Error deleting year: ${error.message}`);
    }
  }
}
