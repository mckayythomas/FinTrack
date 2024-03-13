import { Schema } from "mongoose";
import { IYearDocument } from "../interfaces/IYearDocument";

export const YearSchema = new Schema<IYearDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      description: "Unique identifier for the year",
    },
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
      description: "Reference to the associated board",
    },
    year: {
      type: Number,
      required: true,
      description: "The year represented by this schema",
    },
    totalIncome: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      description:
        "Total income recorded for the year. Must be a non-negative number.",
    },
    totalExpenses: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      description:
        "Total expenses recorded for the year. Must be a non-negative number.",
    },
    createdAt: {
      type: Number,
      description:
        "Timestamp of the board creation (in seconds since Unix epoch)",
    },
    updatedAt: {
      type: Number,
      description:
        "Timestamp of the last board update (in seconds since Unix epoch)",
    },
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);
