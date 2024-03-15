import { MonthRepositoryError } from "@/infrastructure/adapters/repositories/MonthRepository";
import { IMonthEntity } from "@/domain/entities/IMonthEntity";
import { IMonthRepository } from "@/infrastructure/adapters/interfaces/IMonthRepository";

class GetMonthByIdError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getMonthById(
  monthId: string,
  monthRepository: IMonthRepository
): Promise<IMonthEntity> {
  try {
    const month = await monthRepository.findOneById(monthId);
    if (!month) {
      throw new GetMonthByIdError(
        `Unable to find month with monthId: ${monthId}`
      );
    }
    return month;
  } catch (error: any) {
    if (error instanceof MonthRepositoryError) {
      throw error;
    } else {
      throw new GetMonthByIdError(`Error finding month: ${error.message}`);
    }
  }
}
