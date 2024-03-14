import mongoose, { Document } from "mongoose";

export interface IMonthDocument extends Document {
  _id?: mongoose.Types.ObjectId | string;
  yearId: mongoose.Types.ObjectId | string;
  month: number;
  totalIncome?: number;
  totalExpenses?: number;
  createdAt?: number;
  updatedAt?: number;
}
