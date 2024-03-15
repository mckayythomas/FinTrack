import { TransactionRepositoryError } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { ITransactionRepository } from "@/infrastructure/adapters/interfaces/ITransactionRepository";

class DeleteTransactionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function deleteTransaction(
  transactionId: string,
  transactionRepository: ITransactionRepository
): Promise<void> {
  try {
    await transactionRepository.delete(transactionId);
  } catch (error: any) {
    if (error instanceof TransactionRepositoryError) {
      throw error;
    } else {
      throw new DeleteTransactionError(
        `Error deleting transaction: ${error.message}`
      );
    }
  }
}
