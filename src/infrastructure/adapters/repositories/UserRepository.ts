import mongoose from "mongoose";
import dbConnect from "@/infrastructure/db/mongoose.connection";
import { UserModel } from "@/infrastructure/db/mongooseModels/user.model";
import { IUserEntity } from "@/domain/entities/IUserEntity";
import { IUserRepository } from "../interfaces/IUserRepository";
import { mapUserDocumentToEntity } from "../userMapper";

export class UserRepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserRepository implements IUserRepository {
  async findAllUsers(): Promise<IUserEntity[]> {
    try {
      await dbConnect();
      const users = await UserModel.find({});
      // Map doc to entity
      const usersAsEntity = users.map(mapUserDocumentToEntity);
      return usersAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new UserRepositoryError(`Mongoose error finding users: ${error}`);
      } else {
        throw new UserRepositoryError(`Error finding users \n${error.message}`);
      }
    }
  }
  async findUserById(userId: string): Promise<IUserEntity> {
    try {
      await dbConnect();
      const user = await UserModel.findById(userId);
      if (!user) {
        return user;
      }

      // Map to entity from doc
      const userAsEntity = mapUserDocumentToEntity(user);
      return userAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new UserRepositoryError(`Mongoose error finding user: ${error}`);
      } else {
        throw new UserRepositoryError(
          `Error finding user for id: ${userId} \n${error.message}`
        );
      }
    }
  }
  async update(
    userId: string,
    user: Partial<IUserEntity>
  ): Promise<IUserEntity> {
    try {
      await dbConnect();
      const updatedUser = await UserModel.findByIdAndUpdate(userId, user, {
        new: true,
      });

      // Handle update Error
      if (!updatedUser) {
        throw new UserRepositoryError(
          `User with ID ${userId} not found or update failed`
        );
      }

      // Map to entity from doc
      const updatedUserAsEntity = mapUserDocumentToEntity(updatedUser);
      return updatedUserAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new UserRepositoryError(
          `Mongoose error creating updating board: ${error.message}`
        );
      } else {
        throw new UserRepositoryError(
          `Error updating board with id: ${userId} to: ${user} \n${error.message}`
        );
      }
    }
  }
}
