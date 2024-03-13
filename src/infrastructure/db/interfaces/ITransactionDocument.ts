import mongoose, { Document } from "mongoose";

export interface ITransactionDocument extends Document {
  _id?: mongoose.Types.ObjectId | string;
  monthId: mongoose.Types.ObjectId | string;
  name: string;
  type: "income" | "expense";
  amount: number;
  date: number;
  location: string;
  description?: string;
  category:
    | "housing"
    | "transportation"
    | "food"
    | "utilities"
    | "healthcare"
    | "insurance"
    | "household supplies"
    | "personal"
    | "education"
    | "entertainment"
    | "other"
    | "salary"
    | "commission"
    | "bonus"
    | "gifts"
    | "dividend";
  customCategory?: mongoose.Types.ObjectId | string;
  createdAt: number;
  updatedAt: number;
}
