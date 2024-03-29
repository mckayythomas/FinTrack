import { IYearEntity } from "@/domain/entities/IYearEntity";
import { IYearDocument } from "../db/interfaces/IYearDocument";

export function mapYearDocumentToEntity(
  yearDocument: IYearDocument
): IYearEntity {
  return {
    _id: yearDocument._id?.toString(),
    boardId: yearDocument.boardId.toString(),
    year: yearDocument.year,
    totalIncome: yearDocument.totalIncome,
    totalExpenses: yearDocument.totalExpenses,
    createdAt: yearDocument.createdAt,
    updatedAt: yearDocument.updatedAt,
  };
}
