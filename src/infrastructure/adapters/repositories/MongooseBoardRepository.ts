import { BoardModel } from "../../db/models/board.model";
import { IBoardEntity } from "../../../domain/entities/BoardEntity";
import { IBoardRepository } from "../BoardRepository";
import { mapBoardModelToEntity } from "../board.mapper";
import mongoose from "mongoose";

export class BoardRepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class MongooseBoardRepository implements IBoardRepository {
  async findAllByUserId(userId: string): Promise<IBoardEntity[]> {
    try {
      const boards = await BoardModel.find({ userId: userId });

      // Check for empty results
      if (boards.length === 0) {
        throw new BoardRepositoryError(`No boards found for userId: ${userId}`);
      }

      // Map to entity from document
      const boardsAsEntity = boards.map(mapBoardModelToEntity);
      return boardsAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new BoardRepositoryError(`Invalid user ID: ${userId}`);
        } else {
          throw new BoardRepositoryError(
            `Mongoose error finding boards with userId: ${userId} \n${error.message}`
          );
        }
      } else {
        throw new BoardRepositoryError(
          `Error finding boards with userId: ${userId} \n${error.message}`
        );
      }
    }
  }

  async findOneById(id: string): Promise<IBoardEntity> {
    try {
      const board = await BoardModel.findById(id);

      // Handle board not found
      if (!board) {
        throw new BoardRepositoryError(`Board with ID ${id} not found`);
      }

      // Map to entity from document
      const boardAsEntity = mapBoardModelToEntity(board);
      return boardAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new BoardRepositoryError(
          `Mongoose error finding board: ${error}`
        );
      } else {
        throw new BoardRepositoryError(
          `Error finding board for id: ${id} \n${error.message}`
        );
      }
    }
  }

  async create(board: IBoardEntity): Promise<IBoardEntity> {
    try {
      const boardModel = new BoardModel(board);
      const newBoard = await boardModel.save();

      // Handle board not created
      if (!newBoard) {
        throw Error;
      }

      // Map to entity from document
      const newBoardAsEntity = mapBoardModelToEntity(newBoard);
      return newBoardAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new BoardRepositoryError(
          `Mongoose error creating board: ${error.message}`
        );
      } else {
        throw new BoardRepositoryError(
          `Error creating board: ${board} \n${error.message}`
        );
      }
    }
  }

  async update(board: IBoardEntity): Promise<IBoardEntity> {
    try {
      const updatedBoard = await BoardModel.findByIdAndUpdate(
        board._id,
        board,
        {
          new: true,
        }
      );
      // Handle update error
      if (!updatedBoard) {
        throw new BoardRepositoryError(
          `Board with ID ${board._id} not found or update failed`
        );
      }

      // Map to entity from board
      const updatedBoardAsEntity = mapBoardModelToEntity(updatedBoard);
      return updatedBoardAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new BoardRepositoryError(
          `Mongoose error creating updating board: ${error.message}`
        );
      } else {
        throw new BoardRepositoryError(
          `Error updating board with id: ${board._id} to: ${board} \n${error.message}`
        );
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await BoardModel.findByIdAndDelete(id);
      return;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new BoardRepositoryError(`Invalid board ID: ${id}`);
        } else {
          throw new BoardRepositoryError(
            `Mongoose error deleting board: ${error.message}`
          );
        }
      } else {
        throw new BoardRepositoryError(
          `Unexpected error deleting board with id ${id}: \n${error.message}`
        );
      }
    }
  }

  async findAllSharedBoards(userId: string): Promise<IBoardEntity[]> {
    try {
      const sharedBoards = await BoardModel.find({
        sharedUsers: { $elemMatch: { userId: userId } },
      });
      if (sharedBoards.length === 0) {
        throw new BoardRepositoryError(
          `No shared boards found with userId: ${userId}`
        );
      }

      const sharedBoardsAsEntity = sharedBoards.map(mapBoardModelToEntity);

      return sharedBoardsAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new BoardRepositoryError(`Invalid user ID: ${userId}`);
        } else {
          throw new BoardRepositoryError(
            `Mongoose error finding shared boards with userId: ${userId} \n${error.message}`
          );
        }
      } else {
        throw new BoardRepositoryError(
          `Error finding shared boards with userId: ${userId} \n${error.message}`
        );
      }
    }
  }
}
