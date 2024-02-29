import { BoardModel } from "../../db/models/board.model";
import { IBoardEntity } from "../../../domain/entities/BoardEntity";
import { IBoardRepository } from "../BoardRepository";
import { mapBoardModelToEntity } from "../board.mapper";

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
    } catch (error) {
      throw new BoardRepositoryError(
        `Error finding boards for userId: ${userId}`
      );
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
    } catch (error) {
      throw new BoardRepositoryError(`Error finding board for id: ${id}`);
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
    } catch (error) {
      throw new BoardRepositoryError(`Error creating board: ${board}`);
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
      if (updatedBoard === null) throw Error;

      // Map to entity from board
      const updatedBoardAsEntity = mapBoardModelToEntity(updatedBoard);
      return updatedBoardAsEntity;
    } catch (error) {
      throw new BoardRepositoryError(
        `Error updating board with id: ${board._id} to: ${board}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedBoard = await BoardModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BoardRepositoryError(`Error deleting board with id: ${id}`);
    }
  }

  async findAllSharedBoards(userId: string): Promise<IBoardEntity[]> {
    try {
      const sharedBoards = await BoardModel.find({
        sharedUsers: { $elemMatch: { userId: userId } },
      });
      if (sharedBoards === null) throw Error;

      const sharedBoardsAsEntity = sharedBoards.map(mapBoardModelToEntity);

      return sharedBoardsAsEntity;
    } catch (error) {
      throw new BoardRepositoryError(
        `Error finding shared boards with userId: ${userId}`
      );
    }
  }
}
