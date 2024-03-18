import { YearRepositoryError } from "@/infrastructure/adapters/repositories/YearRepository";
import { IYearEntity } from "@/domain/entities/IYearEntity";
import { IYearRepository } from "@/infrastructure/adapters/interfaces/IYearRepository";

class CreateYearError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function createYear(
  year: IYearEntity,
  yearRepository: IYearRepository
): Promise<IYearEntity> {
  try {
    const createdYear = await yearRepository.create(year);
    if (!createdYear) {
      throw new CreateYearError(`Unable to create year: ${year}`);
    }
    return createdYear;
  } catch (error: any) {
    if (error instanceof YearRepositoryError) {
      throw error;
    } else {
      throw new CreateYearError(`Error creating year: ${error.message}`);
    }
  }
}
