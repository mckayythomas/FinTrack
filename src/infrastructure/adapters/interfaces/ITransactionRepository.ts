import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";

export interface ITransactionRepository {
  findAllByMonthId(monthId: string): Promise<ITransactionEntity[]>;
  findOneById(transactionId: string): Promise<ITransactionEntity>;
  create(transaction: ITransactionEntity): Promise<ITransactionEntity>;
  update(
    transactionId: string,
    transaction: Partial<ITransactionEntity>
  ): Promise<ITransactionEntity>;
  delete(transactionId: string): Promise<void>;
}
