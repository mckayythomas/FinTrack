import { TransactionRepositoryError } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { BoardRepositoryError } from "@/infrastructure/adapters/repositories/BoardRepository";
import { YearRepositoryError } from "@/infrastructure/adapters/repositories/YearRepository";
import { MonthRepositoryError } from "@/infrastructure/adapters/repositories/MonthRepository";

import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { IYearEntity } from "@/domain/entities/IYearEntity";
import { IMonthEntity } from "@/domain/entities/IMonthEntity";

import { ITransactionRepository } from "@/infrastructure/adapters/interfaces/ITransactionRepository";
import { IBoardRepository } from "@/infrastructure/adapters/interfaces/IBoardRepository";
import { IYearRepository } from "@/infrastructure/adapters/interfaces/IYearRepository";
import { IMonthRepository } from "@/infrastructure/adapters/interfaces/IMonthRepository";

class CreateTransactionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function createTransaction(
  transaction: ITransactionEntity,
  transactionRepository: ITransactionRepository,
  boardRepository: IBoardRepository,
  yearRepository: IYearRepository,
  monthRepository: IMonthRepository,
  boardId: string
): Promise<ITransactionEntity> {
  try {
    // Check for board existence
    const board: IBoardEntity | null = await boardRepository.findOneById(
      boardId
    );
    if (!board) {
      throw new BoardRepositoryError(`Cannot find board with id: ${boardId}`);
    }

    const transactionDate = new Date(transaction.date! * 1000);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();
    let monthId: string;
    // Check for existence of year and months for that board and get Id
    const years = await yearRepository.findAllByBoardId(boardId);
    const year = years.find((year) => year.boardId === boardId);

    if (year) {
      const months = await monthRepository.findAllByYearId(year._id!);
      const month = months.find((month) => month.month === transactionMonth);
      if (!month) {
        throw new CreateTransactionError(
          `Error creating transaction, month: ${transactionMonth} doesn't exist for year: ${transactionYear}`
        );
      }
      monthId = month._id!;
    } else {
      // Create year and months if the year doesn't exist
      const newYearData: IYearEntity = {
        boardId: boardId,
        year: transactionYear,
      };
      const newYear = await yearRepository.create(newYearData);
      if (!newYear) {
        throw new CreateTransactionError(
          `Unable to create year ${transactionYear} for board: ${boardId}`
        );
      }

      // Create all months for the year
      const monthNumber = 1;
      while (monthNumber <= 12) {
        const newMonthData: IMonthEntity = {
          yearId: newYear._id!,
          month: monthNumber,
        };

        const newMonth = await monthRepository.create(newMonthData);
        if (!newMonth) {
          throw new CreateTransactionError(
            `Error creating necessary months for transaction date: ${transactionDate}`
          );
        }
        if (monthNumber === transactionMonth) {
          monthId = newMonth._id!;
        }
      }
    }

    // Create transaction
    const transactionData: ITransactionEntity = {
      monthId: monthId!,
      name: transaction.name!,
      type: transaction.type!,
      amount: transaction.amount!,
      date: transaction.date!,
      location: transaction.location!,
      description: transaction.description,
      category: transaction.category!,
      customCategory: transaction.customCategory,
    };

    const newTransaction = await transactionRepository.create(transactionData);
    if (!newTransaction) {
      throw new CreateTransactionError(
        `Failed to create transaction: ${transaction}`
      );
    }

    // Return new transaction
    return newTransaction;
  } catch (error: any) {
    if (
      error instanceof BoardRepositoryError ||
      error instanceof YearRepositoryError ||
      error instanceof MonthRepositoryError ||
      error instanceof TransactionRepositoryError
    ) {
      throw error;
    } else {
      throw new CreateTransactionError(
        `Error creating transaction: ${error.message}`
      );
    }
  }
}
