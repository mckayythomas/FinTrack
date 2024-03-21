import mongoose, { Document } from "mongoose";

export interface IBoardDocument extends Document {
  _id?: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  name: String;
  description?: String;
  privacy: "private" | "shared";
  sharedUsers?: {
    userId: mongoose.Types.ObjectId | string;
    accessLevel: "view-only" | "contributor";
  }[];
  createdAt: number;
  updatedAt: number;
}
