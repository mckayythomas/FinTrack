import { MonthRepositoryError } from "@/infrastructure/adapters/repositories/MonthRepository";
import { TransactionRepositoryError } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { YearRepositoryError } from "@/infrastructure/adapters/repositories/YearRepository";

import { IMonthRepository } from "@/infrastructure/adapters/interfaces/IMonthRepository";
import { ITransactionRepository } from "@/infrastructure/adapters/interfaces/ITransactionRepository";
import { IYearRepository } from "@/infrastructure/adapters/interfaces/IYearRepository";

export class AggregateTransactionsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function aggregateTransactions(
  monthId: string,
  yearId: string,
  transactionRepository: ITransactionRepository,
  monthRepository: IMonthRepository,
  yearRepository: IYearRepository
): Promise<void> {
  try {
    // Aggregate month
    const aggregatedTransactionsByMonth =
      await transactionRepository.aggregateTransactionsByMonth(monthId);
    if (!aggregatedTransactionsByMonth) {
      throw new AggregateTransactionsError(
        `Failed to aggregate transactions for monthId: ${monthId}`
      );
    }
    const aggregatedMonthData = {
      totalExpenses: aggregatedTransactionsByMonth.totalExpenses,
      totalIncome: aggregatedTransactionsByMonth.totalIncome,
    };
    const aggregatedMonth = await monthRepository.update(
      monthId,
      aggregatedMonthData
    );
    if (!aggregatedMonth) {
      throw new AggregateTransactionsError(
        `Failed to update month: ${monthId} with new aggregated data: ${aggregatedMonthData}`
      );
    }
    // Aggregate year
    const aggregatedTransactionsByYear =
      await monthRepository.aggregateTransactionsByYear(yearId);
    if (!aggregatedTransactionsByYear) {
      throw new AggregateTransactionsError(
        `Failed to aggregate transactions for yearId: ${yearId}`
      );
    }
    const aggregatedYearData = {
      totalExpenses: aggregatedTransactionsByYear.totalExpenses,
      totalIncome: aggregatedTransactionsByYear.totalIncome,
    };
    const aggregatedYear = await yearRepository.update(
      yearId,
      aggregatedYearData
    );
    if (!aggregatedYear) {
      throw new AggregateTransactionsError(
        `Failed to update year: ${yearId} with new aggregated data: ${aggregatedYearData}`
      );
    }
  } catch (error: any) {
    if (
      error instanceof TransactionRepositoryError ||
      error instanceof MonthRepositoryError ||
      error instanceof YearRepositoryError
    ) {
      throw error;
    } else {
      throw new AggregateTransactionsError(
        `Unexpected error when aggregating transactions: ${error.message}`
      );
    }
  }
}
