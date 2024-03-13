import { IBoardEntity } from "@/domain/entities/IBoardEntity";

export interface IBoardRepository {
  findAllByUserId(userId: string): Promise<IBoardEntity[]>;
  findOneById(boardId: string): Promise<IBoardEntity> | null;
  create(board: IBoardEntity): Promise<IBoardEntity>;
  update(boardId: string, board: Partial<IBoardEntity>): Promise<IBoardEntity>;
  delete(boardId: string): Promise<void>;
  findAllSharedBoards(userId: string): Promise<IBoardEntity[]>;
}
