import { TransactionRepositoryError } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { ITransactionRepository } from "@/infrastructure/adapters/interfaces/ITransactionRepository";

class CreateTransactionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function createTransaction(
  transaction: ITransactionEntity,
  transactionRepository: ITransactionRepository
): Promise<ITransactionEntity> {
  try {
    const newTransaction = await transactionRepository.create(transaction);
    if (!newTransaction) {
      throw new CreateTransactionError(
        `Failed to create transaction: ${transaction}`
      );
    }

    return newTransaction;
  } catch (error: any) {
    if (error instanceof TransactionRepositoryError) {
      throw error;
    } else {
      throw new CreateTransactionError(
        `Error creating transaction: ${error.message}`
      );
    }
  }
}
