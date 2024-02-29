import { IBoardEntity } from "@/domain/entities/BoardEntity";

export interface IBoardRepository {
  findAllByUserId(userId: string): Promise<IBoardEntity[]>;
  findOneById(id: string): Promise<IBoardEntity> | null;
  create(board: IBoardEntity): Promise<IBoardEntity>;
  update(board: IBoardEntity): Promise<IBoardEntity>;
  delete(id: string): Promise<void>;
  findAllSharedBoards(userId: string): Promise<IBoardEntity[]>;
}
