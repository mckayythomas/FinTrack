import { IUserEntity } from "@/domain/entities/IUserEntity";

export interface IUserRepository {
  findAllUsers(): Promise<IUserEntity[]>;
  findUserById(userId: string): Promise<IUserEntity>;
  update(userId: string, user: Partial<IUserEntity>): Promise<IUserEntity>;
}
