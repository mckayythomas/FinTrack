import { TransactionRepositoryError } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { ITransactionRepository } from "@/infrastructure/adapters/interfaces/ITransactionRepository";

class UpdateTransactionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function updateTransaction(
  transactionId: string,
  transaction: Partial<ITransactionEntity>,
  transactionRepository: ITransactionRepository
): Promise<ITransactionEntity> {
  try {
    const updatedTransaction = await transactionRepository.update(
      transactionId,
      transaction
    );
    if (!updatedTransaction) {
      throw new UpdateTransactionError(
        `Unable to update transaction data for transaction: ${transactionId}`
      );
    }
    return updatedTransaction;
  } catch (error: any) {
    if (error instanceof TransactionRepositoryError) {
      throw error;
    } else {
      throw new UpdateTransactionError(
        `Error updating transaction: ${error.message}`
      );
    }
  }
}
