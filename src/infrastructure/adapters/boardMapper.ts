import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { IBoardDocument } from "../db/interfaces/IBoardDocument";

export function mapBoardDocumentToEntity(
  boardDocument: IBoardDocument
): IBoardEntity {
  // If shared users convert to string as needed by the entity
  const convertedSharedUsers = boardDocument.sharedUsers
    ? boardDocument.sharedUsers.map((sharedUser) => ({
        userId: sharedUser.userId.toString(),
        accessLevel: sharedUser.accessLevel,
      }))
    : [];

  // Return board as entity of board mapped from model
  return {
    _id: boardDocument._id?.toString(),
    userId: boardDocument.userId.toString(),
    name: boardDocument.name.toString(),
    privacy: boardDocument.privacy,
    createdAt: boardDocument.createdAt,
    updatedAt: boardDocument.updatedAt,
    description: boardDocument.description?.toString(),
    sharedUsers: convertedSharedUsers,
  };
}
