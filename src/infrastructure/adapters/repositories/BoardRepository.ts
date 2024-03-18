import mongoose from "mongoose";
import dbConnect from "@/infrastructure/db/mongoose.connection";
import { BoardModel } from "../../db/mongooseModels/board.model";
import { IBoardEntity } from "../../../domain/entities/IBoardEntity";
import { IBoardRepository } from "../interfaces/IBoardRepository";
import { mapBoardDocumentToEntity } from "../boardMapper";

export class BoardRepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BoardRepository implements IBoardRepository {
  async findAllByUserId(userId: string): Promise<IBoardEntity[]> {
    try {
      await dbConnect();
      const boards = await BoardModel.find({ userId: userId });

      // Map to entity from document
      const boardsAsEntity = boards.map(mapBoardDocumentToEntity);
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

  async findOneById(boardId: string): Promise<IBoardEntity> {
    try {
      await dbConnect();
      const board = await BoardModel.findById(boardId);

      // Handle board not found
      if (!board) {
        return board;
      }

      // Map to entity from document
      const boardAsEntity = mapBoardDocumentToEntity(board);
      return boardAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new BoardRepositoryError(
          `Mongoose error finding board: ${error}`
        );
      } else {
        throw new BoardRepositoryError(
          `Error finding board for id: ${boardId} \n${error.message}`
        );
      }
    }
  }

  async create(board: IBoardEntity): Promise<IBoardEntity> {
    try {
      await dbConnect();
      const newObjectId = new mongoose.Types.ObjectId();
      board._id = newObjectId.toString();
      const boardModel = new BoardModel(board);
      const newBoard = await boardModel.save();

      // Handle board not created
      if (!newBoard) {
        throw new BoardRepositoryError(`Error creating board: ${board}`);
      }

      // Map to entity from document
      const newBoardAsEntity = mapBoardDocumentToEntity(newBoard);
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

  async update(
    boardId: string,
    board: Partial<IBoardEntity>
  ): Promise<IBoardEntity> {
    try {
      await dbConnect();
      const updatedBoard = await BoardModel.findByIdAndUpdate(boardId, board, {
        new: true,
      });

      // Handle update error
      if (!updatedBoard) {
        throw new BoardRepositoryError(
          `Board with ID ${boardId} not found or update failed`
        );
      }

      // Map to entity from board
      const updatedBoardAsEntity = mapBoardDocumentToEntity(updatedBoard);
      return updatedBoardAsEntity;
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        throw new BoardRepositoryError(
          `Mongoose error creating updating board: ${error.message}`
        );
      } else {
        throw new BoardRepositoryError(
          `Error updating board with id: ${boardId} to: ${board} \n${error.message}`
        );
      }
    }
  }

  async delete(boardId: string): Promise<void> {
    try {
      await dbConnect();
      await BoardModel.findByIdAndDelete(boardId);
    } catch (error: any) {
      if (error instanceof mongoose.Error) {
        if (error.name === "CastError") {
          throw new BoardRepositoryError(`Invalid board Id: ${boardId}`);
        } else {
          throw new BoardRepositoryError(
            `Mongoose error deleting board with id:${boardId} \n${error.message}`
          );
        }
      } else {
        throw new BoardRepositoryError(
          `Unexpected error deleting board with id ${boardId}: \n${error.message}`
        );
      }
    }
  }

  async findAllSharedBoards(userId: string): Promise<IBoardEntity[]> {
    try {
      const sharedBoards = await BoardModel.find({
        sharedUsers: { $elemMatch: { userId: userId } },
      });

      const sharedBoardsAsEntity = sharedBoards.map(mapBoardDocumentToEntity);

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
