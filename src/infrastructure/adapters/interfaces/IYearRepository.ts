import { IYearEntity } from "@/domain/entities/IYearEntity";

export interface IYearRepository {
  findAllByBoardId(boardId: string): Promise<IYearEntity[]>;
  findOneById(yearId: string): Promise<IYearEntity>;
  create(year: IYearEntity): Promise<IYearEntity>;
  update(yearId: string, year: Partial<IYearEntity>): Promise<IYearEntity>;
  delete(yearId: string): Promise<void>;
}
