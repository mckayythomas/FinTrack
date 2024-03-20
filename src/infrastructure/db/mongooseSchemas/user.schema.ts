import { Schema } from "mongoose";
import { IUserDocument } from "../interfaces/IUserDocument";

export const UserSchema = new Schema<IUserDocument>({
  _id: {
    type: Schema.Types.ObjectId,
    description: "Unique identifier for the user",
  },
  name: {
    type: String,
    required: true,
    description: "Name of the user",
  },
  email: {
    type: String,
    required: true,
    description: "Email used to register user",
  },
  image: {
    type: String,
    required: true,
    description: "URL for the picture of a user",
  },
  emailVerified: {
    type: Boolean || null,
    required: true,
    description: "Whether or not the user has validated their email or not",
  },
});
