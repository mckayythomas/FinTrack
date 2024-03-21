import { MonthRepositoryError } from "@/infrastructure/adapters/repositories/MonthRepository";
import { IMonthEntity } from "@/domain/entities/IMonthEntity";
import { IMonthRepository } from "@/infrastructure/adapters/interfaces/IMonthRepository";

class CreateMonthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function createMonth(
  month: IMonthEntity,
  monthRepository: IMonthRepository
) {
  try {
    const createdMonth = await monthRepository.create(month);
    if (!createdMonth) {
      throw new CreateMonthError(`Unable to create month: ${month}`);
    }
    return createdMonth;
  } catch (error: any) {
    if (error instanceof MonthRepositoryError) {
      throw error;
    } else {
      throw new CreateMonthError(`Error creating month: ${error.message}`);
    }
  }
}
