import { YearModel } from "@/infrastructure/db/mongooseModels/year.model";
import { IYearEntity } from "@/domain/entities/IYearEntity";
import { IYearRepository } from "../interfaces/IYearRepository";
import { mapYearDocumentToEntity } from "../yearMapper";
import dbConnect from "@/infrastructure/db/mongoose.connection";
import mongoose from "mongoose";

export class YearRepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class YearRepository implements IYearRepository {
  async findAllByBoardId(boardId: string): Promise<IYearEntity[]> {
    try {
      await dbConnect();
      const months = await YearModel.find({ boardId: boardId });

      // Check for empty results
      if (months.length === 0) {
        throw new YearRepositoryError(
          `No months found for boardId: ${boardId}`
        );
      }

      // Map to entity from document
      const yearsAsEntity = months.map(mapYearDocumentToEntity);
      return yearsAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new YearRepositoryError(`Invalid board ID: ${boardId}`);
        } else {
          throw new YearRepositoryError(
            `Mongoose error finding years with boardId: ${boardId} \n${error.message}`
          );
        }
      } else {
        throw new YearRepositoryError(
          `Error finding months with boardId: ${boardId} \n${error.message}`
        );
      }
    }
  }

  async findOneById(yearId: string): Promise<IYearEntity> {
    try {
      await dbConnect();
      const month = await YearModel.findById(yearId);

      // Handle month not found
      if (!month) {
        throw new YearRepositoryError(`Month with ID ${yearId} not found`);
      }

      // Map to entity from document
      const monthAsEntity = mapYearDocumentToEntity(month);
      return monthAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new YearRepositoryError(`Mongoose error finding year: ${error}`);
      } else {
        throw new YearRepositoryError(
          `Error finding year for id: ${yearId} \n${error.message}`
        );
      }
    }
  }

  async create(year: IYearEntity): Promise<IYearEntity> {
    try {
      await dbConnect();
      const newObjectId = new mongoose.Types.ObjectId();
      year._id = newObjectId.toString();
      const yearModel = new YearModel(year);
      const newYear = yearModel.save();

      //   Handle creation error
      if (!newYear) {
        throw new YearRepositoryError(`Error creating year: ${year}`);
      }

      // Map to entity from document
      const newYearAsEntity = mapYearDocumentToEntity(newYear);
      return newYearAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new YearRepositoryError(
          `Mongoose error creating year: ${error.message}`
        );
      } else {
        throw new YearRepositoryError(
          `Error creating year: ${year} \n${error.message}`
        );
      }
    }
  }

  async update(
    yearId: string,
    year: Partial<IYearEntity>
  ): Promise<IYearEntity> {
    try {
      await dbConnect();
      const updatedYear = await YearModel.findByIdAndUpdate(yearId, year, {
        new: true,
      });

      // Handle update error
      if (!updatedYear) {
        throw new YearRepositoryError(
          `Year with ID ${yearId} not found or update failed`
        );
      }

      // Map to entity from document
      const updatedYearAsEntity = mapYearDocumentToEntity(updatedYear);
      return updatedYearAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new YearRepositoryError(
          `Mongoose error creating updating year: ${error.message}`
        );
      } else {
        throw new YearRepositoryError(
          `Error updating year with id: ${yearId} to: ${year} \n${error.message}`
        );
      }
    }
  }

  async delete(yearId: string): Promise<void> {
    try {
      await dbConnect();
      const deletedYear = await YearModel.findByIdAndDelete(yearId);
      if (!deletedYear) {
        throw new YearRepositoryError(`Year with id ${yearId}`);
      }
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new YearRepositoryError(`Invalid year Id: ${yearId}`);
        } else {
          throw new YearRepositoryError(
            `Mongoose error deleting year with id:${yearId} \n${error.message}`
          );
        }
      } else {
        throw new YearRepositoryError(
          `Unexpected error deleting year with id ${yearId}: \n${error.message}`
        );
      }
    }
  }
}
