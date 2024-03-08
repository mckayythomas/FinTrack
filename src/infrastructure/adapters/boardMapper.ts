import { IBoardDocument } from "../db/interfaces/IBoardDocument";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";

export function mapBoardDocumentToEntity(
  boardModel: IBoardDocument
): IBoardEntity {
  // If shared users convert to string as needed by the entity
  const convertedSharedUsers = boardModel.sharedUsers
    ? boardModel.sharedUsers.map((sharedUser) => ({
        userId: sharedUser.userId.toString(),
        accessLevel: sharedUser.accessLevel,
      }))
    : [];

  // Return board as entity of board mapped from model
  return {
    _id: boardModel._id?.toString(),
    userId: boardModel.userId.toString(),
    name: boardModel.name.toString(),
    privacy: boardModel.privacy,
    createdAt: boardModel.createdAt,
    updatedAt: boardModel.updatedAt,
    description: boardModel.description?.toString(),
    sharedUsers: convertedSharedUsers,
  };
}
