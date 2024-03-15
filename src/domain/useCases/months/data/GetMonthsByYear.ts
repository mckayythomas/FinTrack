import { MonthRepositoryError } from "@/infrastructure/adapters/repositories/MonthRepository";
import { IMonthEntity } from "@/domain/entities/IMonthEntity";
import { IMonthRepository } from "@/infrastructure/adapters/interfaces/IMonthRepository";

class GetMonthsByYearError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getMonthsByYear(
  yearId: string,
  monthRepository: IMonthRepository
): Promise<IMonthEntity[]> {
  try {
    const months = await monthRepository.findAllByYearId(yearId);
    if (months.length === 0) {
      throw new GetMonthsByYearError(`No months found for yearId: ${yearId}`);
    }
    return months;
  } catch (error: any) {
    if (error instanceof MonthRepositoryError) {
      throw error;
    } else {
      throw new GetMonthsByYearError(`Error getting months: ${error.message}`);
    }
  }
}
