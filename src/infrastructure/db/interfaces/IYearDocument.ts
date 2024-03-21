import mongoose, { Document } from "mongoose";

export interface IYearDocument extends Document {
  _id?: mongoose.Types.ObjectId | string;
  boardId: mongoose.Types.ObjectId | string;
  year: number;
  totalIncome?: number;
  totalExpenses?: number;
  createdAt?: number;
  updatedAt?: number;
}
