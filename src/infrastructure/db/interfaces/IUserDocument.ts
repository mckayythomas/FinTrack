import mongoose, { Document } from "mongoose";

export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean | null;
}
