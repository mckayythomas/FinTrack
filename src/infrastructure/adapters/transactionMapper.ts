import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { ITransactionDocument } from "../db/interfaces/ITransactionDocument";

export function mapTransactionDocumentToEntity(
  transactionDocument: ITransactionDocument
): ITransactionEntity {
  return {
    _id: transactionDocument._id?.toString(),
    monthId: transactionDocument.monthId.toString(),
    name: transactionDocument.name,
    type: transactionDocument.type,
    amount: transactionDocument.amount,
    date: transactionDocument.date,
    location: transactionDocument.location,
    description: transactionDocument.description,
    category: transactionDocument.category,
    customCategory: transactionDocument.customCategory?.toString(),
    createdAt: transactionDocument.createdAt,
    updatedAt: transactionDocument.updatedAt,
  };
}
