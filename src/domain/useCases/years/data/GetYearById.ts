import { YearRepositoryError } from "@/infrastructure/adapters/repositories/YearRepository";
import { IYearEntity } from "@/domain/entities/IYearEntity";
import { IYearRepository } from "@/infrastructure/adapters/interfaces/IYearRepository";

class GetYearByIdError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getYearById(
  yearId: string,
  yearRepository: IYearRepository
): Promise<IYearEntity> {
  try {
    const year = await yearRepository.findOneById(yearId);
    if (!year) {
      throw new GetYearByIdError(`Unable to find year with yearId: ${yearId}`);
    }
    return year;
  } catch (error: any) {
    if (error instanceof YearRepositoryError) {
      throw error;
    } else {
      throw new GetYearByIdError(`Error finding year: ${error.message}`);
    }
  }
}
