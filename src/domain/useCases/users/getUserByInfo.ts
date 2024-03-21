import { UserRepositoryError } from "@/infrastructure/adapters/repositories/UserRepository";
import { IUserEntity } from "@/domain/entities/IUserEntity";
import { IUserRepository } from "@/infrastructure/adapters/interfaces/IUserRepository";

class GetUserByInfoError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getUserByInfo(
  userInfo: {
    email?: string;
    name?: string;
    accessLevel?: "contributor" | "view-only";
  },
  userRepository: IUserRepository
): Promise<IUserEntity> {
  try {
    const users = await userRepository.findAllUsers();
    const user = users.find(
      (user) => user.email === userInfo.email || user.name === userInfo.name
    );
    if (!user) {
      throw new GetUserByInfoError(`User with info: ${userInfo} doesn't exist`);
    }

    return user;
  } catch (error: any) {
    if (error instanceof UserRepositoryError) {
      throw error;
    } else {
      throw new GetUserByInfoError(
        `Error getting user based on user info: ${error.message}`
      );
    }
  }
}
