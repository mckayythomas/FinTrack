import mongoose, { model } from "mongoose";
import { TransactionSchema } from "../mongooseSchemas/transaction.schema";
import { ITransactionDocument } from "../interfaces/ITransactionDocument";

export const TransactionModel =
  mongoose.models.Transaction ||
  model<ITransactionDocument>("Transaction", TransactionSchema);
