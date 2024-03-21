import { TransactionRepositoryError } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { ITransactionRepository } from "@/infrastructure/adapters/interfaces/ITransactionRepository";

class GetTransactionByIdError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getTransactionById(
  transactionId: string,
  transactionRepository: ITransactionRepository
): Promise<ITransactionEntity> {
  try {
    const transaction = await transactionRepository.findOneById(transactionId);
    return transaction;
  } catch (error: any) {
    if (error instanceof TransactionRepositoryError) {
      throw error;
    } else {
      throw new GetTransactionByIdError(
        `Error finding transaction: ${error.message}`
      );
    }
  }
}
