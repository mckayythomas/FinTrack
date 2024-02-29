import mongoose from "mongoose";

export interface IBoardDocument {
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
