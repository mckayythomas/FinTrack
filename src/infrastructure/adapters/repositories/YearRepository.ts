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
      const years = await YearModel.find({ boardId: boardId });

      // Map to entity from document
      const yearsAsEntity = years.map(mapYearDocumentToEntity);
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
          `Error finding years with boardId: ${boardId} \n${error.message}`
        );
      }
    }
  }

  async findOneById(yearId: string): Promise<IYearEntity> {
    try {
      await dbConnect();
      const year = await YearModel.findById(yearId);

      // Handle month not found
      if (!year) {
        return year;
      }

      // Map to entity from document
      const yearAsEntity = mapYearDocumentToEntity(year);
      return yearAsEntity;
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
      const newYear = await yearModel.save();

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
      await YearModel.findByIdAndDelete(yearId);
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
