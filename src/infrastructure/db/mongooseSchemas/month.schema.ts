import { Schema } from "mongoose";
import { IMonthDocument } from "../interfaces/IMonthDocument";

export const MonthSchema = new Schema<IMonthDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      description: "Unique identifier for the month",
    },
    yearId: {
      type: Schema.Types.ObjectId,
      required: true,
      description: "Reference to the associated year",
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      description: "The month number (1-12)",
    },
    totalIncome: {
      type: Number,
      default: 0,
      min: 0,
      description:
        "Total income recorded for the year. Must be a non-negative number.",
    },
    totalExpenses: {
      type: Number,
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
