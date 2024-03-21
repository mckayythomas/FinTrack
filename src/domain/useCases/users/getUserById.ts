import { UserRepositoryError } from "@/infrastructure/adapters/repositories/UserRepository";
import { IUserEntity } from "@/domain/entities/IUserEntity";
import { IMonthRepository } from "@/infrastructure/adapters/interfaces/IMonthRepository";
import { IUserRepository } from "@/infrastructure/adapters/interfaces/IUserRepository";

class GetUserByIdError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getUserById(
  userId: string,
  userRepository: IUserRepository
): Promise<IUserEntity> {
  try {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new GetUserByIdError(`Unable to find user by userId: ${userId}`);
    }
    return user;
  } catch (error: any) {
    if (error instanceof UserRepositoryError) {
      throw error;
    } else {
      throw new GetUserByIdError(`Error finding user: ${error.message}`);
    }
  }
}
