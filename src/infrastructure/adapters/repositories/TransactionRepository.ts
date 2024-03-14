import { TransactionModel } from "@/infrastructure/db/mongooseModels/transaction.model";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { mapTransactionDocumentToEntity } from "../transactionMapper";
import dbConnect from "@/infrastructure/db/mongoose.connection";
import mongoose from "mongoose";
import { Transaction } from "mongodb";

export class TransactionRepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class TransactionRepository implements ITransactionRepository {
  async findAllByMonthId(monthId: string): Promise<ITransactionEntity[]> {
    try {
      await dbConnect();
      const transactions = await TransactionModel.find({ monthId: monthId });

      // check for empty results
      if (transactions.length === 0) {
        throw new TransactionRepositoryError(
          `No transactions found for monthId: ${monthId}`
        );
      }

      // Map to entity from document
      const transactionsAsEntity = transactions.map(
        mapTransactionDocumentToEntity
      );
      return transactionsAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new TransactionRepositoryError(`Invalid month ID: ${monthId}`);
        } else {
          throw new TransactionRepositoryError(
            `Mongoose error finding transactions with monthId: ${monthId} \n${error.message}`
          );
        }
      } else {
        throw new TransactionRepositoryError(
          `Error finding transactions with monthId: ${monthId} \n${error.message}`
        );
      }
    }
  }

  async findOneById(transactionId: string): Promise<ITransactionEntity> {
    try {
      await dbConnect();
      const transaction = await TransactionModel.findById(transactionId);

      // Handle transaction not found
      if (!transaction) {
        throw new TransactionRepositoryError(
          `Transaction with ID ${transactionId} not found`
        );
      }

      // Map to entity from document
      const transactionAsEntity = mapTransactionDocumentToEntity(transaction);
      return transactionAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new TransactionRepositoryError(
          `Mongoose error finding transaction: ${error}`
        );
      } else {
        throw new TransactionRepositoryError(
          `Error finding transaction for id: ${transactionId} \n${error.message}`
        );
      }
    }
  }

  async create(transaction: ITransactionEntity): Promise<ITransactionEntity> {
    try {
      await dbConnect();
      const newObjectId = new mongoose.Types.ObjectId();
      transaction._id = newObjectId.toString();
      const transactionModel = new TransactionModel(transaction);
      const newTransaction = transactionModel.save();

      // Handle Transaction not created
      if (!newTransaction) {
        throw new TransactionRepositoryError(
          `Error creating transaction: ${transaction}`
        );
      }

      // Map to entity from document
      const newTransactionAsEntity =
        mapTransactionDocumentToEntity(newTransaction);
      return newTransactionAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new TransactionRepositoryError(
          `Mongoose error creating transaction: ${error.message}`
        );
      } else {
        throw new TransactionRepositoryError(
          `Error creating transaction: ${transaction} \n${error.message}`
        );
      }
    }
  }

  async update(
    transactionId: string,
    transaction: Partial<ITransactionEntity>
  ): Promise<ITransactionEntity> {
    try {
      await dbConnect();
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        transaction,
        { new: true }
      );

      // Handle update error
      if (!updatedTransaction) {
        throw new TransactionRepositoryError(
          `Transaction with ID ${transactionId} not found or update failed`
        );
      }

      // Map to entity from transaction
      const updatedTransactionAsEntity =
        mapTransactionDocumentToEntity(updatedTransaction);
      return updatedTransactionAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new TransactionRepositoryError(
          `Mongoose error creating updating transaction: ${error.message}`
        );
      } else {
        throw new TransactionRepositoryError(
          `Error updating transaction with id: ${transactionId} to: ${transaction} \n${error.message}`
        );
      }
    }
  }

  async delete(transactionId: string): Promise<void> {
    try {
      await dbConnect();
      const deletedTransaction = await TransactionModel.findByIdAndDelete(
        transactionId
      );
      if (!deletedTransaction) {
        throw new TransactionRepositoryError(
          `Transaction with Id: ${transactionId}`
        );
      }
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new TransactionRepositoryError(
            `Invalid transaction Id: ${transactionId}`
          );
        } else {
          throw new TransactionRepositoryError(
            `Mongoose error deleting transaction with id:${transactionId} \n${error.message}`
          );
        }
      } else {
        throw new TransactionRepositoryError(
          `Unexpected error deleting transaction with id ${transactionId}: \n${error.message}`
        );
      }
    }
  }

  async aggregateTransactionsByMonth(
    monthId: string
  ): Promise<{ totalExpenses: number; totalIncome: number }> {
    try {
      await dbConnect();
      const aggregatedTransactions = await TransactionModel.aggregate([
        { $match: { monthId: monthId } },
        { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } },
      ]);

      //  Handle error during aggregating
      if (!aggregatedTransactions) {
        throw new TransactionRepositoryError(
          `Error aggregating transactions with monthId: ${monthId}`
        );
      } else if (aggregatedTransactions.length > 2) {
        throw new TransactionRepositoryError(
          `Error aggregating transactions, data inconsistent: ${aggregatedTransactions}`
        );
      }

      // Return in formatted form
      const formattedAggregatedTransactions = {
        totalExpenses: 0,
        totalIncome: 0,
      };

      for (const transactionTotal of aggregatedTransactions) {
        if (transactionTotal._id === "expense") {
          formattedAggregatedTransactions.totalExpenses =
            transactionTotal.totalAmount;
        } else if (transactionTotal._id === "income") {
          formattedAggregatedTransactions.totalIncome =
            transactionTotal.totalAmount;
        } else {
          throw new TransactionRepositoryError(
            `Error formatting aggregated transactions, data inconsistency with transactionTotal: ${transactionTotal}`
          );
        }
      }

      return formattedAggregatedTransactions;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new TransactionRepositoryError(
          `Mongoose error aggregating amounts for monthId: ${monthId} \n${error.message}`
        );
      } else {
        throw new TransactionRepositoryError(
          `Unexpected error aggregating amounts for monthId: ${monthId} \n${error.message}`
        );
      }
    }
  }
}
