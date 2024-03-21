import { IMonthEntity } from "@/domain/entities/IMonthEntity";
import { IMonthDocument } from "../db/interfaces/IMonthDocument";

export function mapMonthDocumentToEntity(
  monthDocument: IMonthDocument
): IMonthEntity {
  return {
    _id: monthDocument._id?.toString(),
    yearId: monthDocument.yearId.toString(),
    month: monthDocument.month,
    totalIncome: monthDocument.totalIncome,
    totalExpenses: monthDocument.totalExpenses,
    createdAt: monthDocument.createdAt,
    updatedAt: monthDocument.updatedAt,
  };
}
