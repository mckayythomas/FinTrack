import { Schema } from "mongoose";
import { IBoardDocument } from "../interfaces/IBoardDocument";

export const BoardSchema = new Schema<IBoardDocument>({
  _id: {
    type: Schema.Types.ObjectId,
    description: "Unique identifier for the board",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    description: "ID of the user who created the board (foreign key)",
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
    description: "Name of the board",
  },
  description: {
    type: String,
    trim: true,
    maxlength: 256,
    description: "Optional description of the board",
  },
  privacy: {
    type: String,
    enum: ["private", "shared"],
    default: "private",
    description:
      "Privacy setting of the board (private, shared with specific users, public)",
  },
  sharedUsers: {
    type: Array,
    items: {
      type: Object,
      properties: {
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        accessLevel: {
          type: String,
          enum: ["view-only", "contributor"],
          required: true,
        },
      },
      default: [],
    },
    description:
      "Array of user objects with their access levels (view-only or contributor) for shared boards",
  },
  createdAt: {
    type: Number,
    required: true,
    description:
      "Timestamp of the board creation (in seconds since Unix epoch)",
  },
  updatedAt: {
    type: Number,
    required: true,
    description:
      "Timestamp of the last board update (in seconds since Unix epoch)",
  },
});
