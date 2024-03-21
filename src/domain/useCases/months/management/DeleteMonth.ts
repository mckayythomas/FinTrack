import { MonthRepositoryError } from "@/infrastructure/adapters/repositories/MonthRepository";
import { IMonthRepository } from "@/infrastructure/adapters/interfaces/IMonthRepository";

class DeleteMonthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function deleteMonth(
  monthId: string,
  monthRepository: IMonthRepository
): Promise<void> {
  try {
    await monthRepository.delete(monthId);
  } catch (error: any) {
    if (error instanceof MonthRepositoryError) {
      throw error;
    } else {
      throw new DeleteMonthError(`Error deleting month: ${error.message}`);
    }
  }
}
