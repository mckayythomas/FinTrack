import { IUserEntity } from "@/domain/entities/IUserEntity";
import { IUserDocument } from "../db/interfaces/IUserDocument";

export function mapUserDocumentToEntity(
  userDocument: IUserDocument
): IUserEntity {
  return {
    _id: userDocument._id.toString(),
    name: userDocument.name,
    email: userDocument.email,
    image: userDocument.image,
    emailVerified: userDocument.emailVerified,
  };
}
