import { TransactionRepositoryError } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { ITransactionRepository } from "@/infrastructure/adapters/interfaces/ITransactionRepository";

class GetTransactionsByMonthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function getTransactionsByMonth(
  monthId: string,
  transactionRepository: ITransactionRepository
): Promise<ITransactionEntity[]> {
  try {
    const transactions = await transactionRepository.findAllByMonthId(monthId);
    if (transactions.length === 0) {
      throw new GetTransactionsByMonthError(
        `No transactions found for monthId: ${monthId}`
      );
    }
    return transactions;
  } catch (error: any) {
    if (error instanceof TransactionRepositoryError) {
      throw error;
    } else {
      throw new GetTransactionsByMonthError(
        `Error getting transactions: ${error.message}`
      );
    }
  }
}
