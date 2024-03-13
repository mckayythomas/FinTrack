import { IMonthEntity } from "@/domain/entities/IMonthEntity";

export interface IMonthRepository {
  findAllByYearId(yearId: string): Promise<IMonthEntity[]>;
  findOneById(monthId: string): Promise<IMonthEntity>;
  create(month: IMonthEntity): Promise<IMonthEntity>;
  update(monthId: string, month: Partial<IMonthEntity>): Promise<IMonthEntity>;
  delete(monthId: string): Promise<void>;
}
