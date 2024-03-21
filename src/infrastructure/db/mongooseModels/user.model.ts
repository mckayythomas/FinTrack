import mongoose, { model } from "mongoose";
import { UserSchema } from "../mongooseSchemas/user.schema";
import { IUserDocument } from "../interfaces/IUserDocument";

export const UserModel =
  mongoose.models.User || model<IUserDocument>("User", UserSchema);
