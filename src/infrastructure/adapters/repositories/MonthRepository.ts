import { MonthModel } from "@/infrastructure/db/mongooseModels/month.model";
import { IMonthEntity } from "@/domain/entities/IMonthEntity";
import { IMonthRepository } from "../interfaces/IMonthRepository";
import { mapMonthDocumentToEntity } from "../monthMapper";
import dbConnect from "@/infrastructure/db/mongoose.connection";
import mongoose from "mongoose";

export class MonthRepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class MonthRepository implements IMonthRepository {
  async findAllByYearId(yearId: string): Promise<IMonthEntity[]> {
    try {
      await dbConnect();
      const months = await MonthModel.find({ yearId: yearId });

      // Map to entity from document
      const monthsAsEntity = months.map(mapMonthDocumentToEntity);
      return monthsAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new MonthRepositoryError(`Invalid year ID: ${yearId}`);
        } else {
          throw new MonthRepositoryError(
            `Mongoose error finding months with yearId: ${yearId} \n${error.message}`
          );
        }
      } else {
        throw new MonthRepositoryError(
          `Error finding months with yearId: ${yearId} \n${error.message}`
        );
      }
    }
  }

  async findOneById(monthId: string): Promise<IMonthEntity> {
    try {
      await dbConnect();
      const month = await MonthModel.findById(monthId);

      // Handle month not found
      if (!month) {
        return month;
      }

      // Map to entity from document
      const monthAsEntity = mapMonthDocumentToEntity(month);
      return monthAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new MonthRepositoryError(
          `Mongoose error finding month: ${error}`
        );
      } else {
        throw new MonthRepositoryError(
          `Error finding month for id: ${monthId} \n${error.message}`
        );
      }
    }
  }

  async create(month: IMonthEntity): Promise<IMonthEntity> {
    try {
      await dbConnect();
      const newObjectId = new mongoose.Types.ObjectId();
      month._id = newObjectId.toString();
      const monthModel = new MonthModel(month);
      const newMonth = await monthModel.save();

      // Handle month not created
      if (!newMonth) {
        throw new MonthRepositoryError(`Error creating month: ${month}`);
      }

      // Map to entity from document
      const newMonthAsEntity = mapMonthDocumentToEntity(newMonth);
      return newMonthAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new MonthRepositoryError(
          `Mongoose error creating month: ${error.message}`
        );
      } else {
        throw new MonthRepositoryError(
          `Error creating month: ${month} \n${error.message}`
        );
      }
    }
  }

  async update(
    monthId: string,
    month: Partial<IMonthEntity>
  ): Promise<IMonthEntity> {
    try {
      await dbConnect();
      const updatedMonth = await MonthModel.findByIdAndUpdate(monthId, month, {
        new: true,
      });

      // Handle update error
      if (!updatedMonth) {
        throw new MonthRepositoryError(
          `Month with ID ${monthId} not found or update failed`
        );
      }

      // Map to entity from document
      const updatedMonthAsEntity = mapMonthDocumentToEntity(updatedMonth);
      return updatedMonthAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new MonthRepositoryError(
          `Mongoose error creating updating month: ${error.message}`
        );
      } else {
        throw new MonthRepositoryError(
          `Error updating month with id: ${monthId} to: ${month} \n${error.message}`
        );
      }
    }
  }

  async delete(monthId: string): Promise<void> {
    try {
      await dbConnect();
      await MonthModel.findByIdAndDelete(monthId);
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new MonthRepositoryError(`Invalid month Id: ${monthId}`);
        } else {
          throw new MonthRepositoryError(
            `Mongoose error deleting month with id:${monthId} \n${error.message}`
          );
        }
      } else {
        throw new MonthRepositoryError(
          `Unexpected error deleting month with id ${monthId}: \n${error.message}`
        );
      }
    }
  }

  async aggregateTransactionsByYear(
    yearId: string
  ): Promise<{ totalIncome: number; totalExpenses: number }> {
    try {
      await dbConnect();
      const yearIdObjectId = new mongoose.Types.ObjectId(yearId);
      const aggregatedTransactions = await MonthModel.aggregate([
        { $match: { yearId: yearIdObjectId } },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: { $sum: "$totalIncome" } },
            totalExpenses: { $sum: { $sum: "$totalExpenses" } },
          },
        },
      ]);
      //   Handle error during aggregating
      if (!aggregatedTransactions) {
        throw new MonthRepositoryError(
          `Error aggregating transactions with yearId: ${yearId}`
        );
      }

      // Return in formatted form
      const formattedAggregatedTransactions = {
        totalExpenses: aggregatedTransactions[0].totalExpenses,
        totalIncome: aggregatedTransactions[0].totalIncome,
      };

      return formattedAggregatedTransactions;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new MonthRepositoryError(
          `Mongoose error aggregating amounts for yearId: ${yearId} \n${error.message}`
        );
      } else {
        throw new MonthRepositoryError(
          `Unexpected error aggregating amounts for yearId: ${yearId} \n${error.message}`
        );
      }
    }
  }
}
