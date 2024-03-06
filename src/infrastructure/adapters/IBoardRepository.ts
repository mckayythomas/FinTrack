import { IBoardEntity } from "@/domain/entities/BoardEntity";

export interface IBoardRepository {
  findAllByUserId(userId: string): Promise<IBoardEntity[]>;
  findOneById(boardId: string): Promise<IBoardEntity> | null;
  create(board: IBoardEntity): Promise<IBoardEntity>;
  update(boardId: string, board: Partial<IBoardEntity>): Promise<IBoardEntity>;
  delete(id: string): Promise<void>;
  findAllSharedBoards(userId: string): Promise<IBoardEntity[]>;
}
