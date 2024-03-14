import mongoose, { Schema } from "mongoose";
import { ITransactionDocument } from "../interfaces/ITransactionDocument";

export const TransactionSchema = new Schema<ITransactionDocument>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      description: "Unique identifier for the transaction",
    },
    monthId: {
      type: Schema.Types.ObjectId,
      required: true,
      description: "Reference to the associated month.",
      ref: "Month",
    },
    name: {
      type: String,
      required: true,
      description: "Name of the transaction item.",
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      description: "Determines if the item is money spent or money gained.",
    },
    amount: {
      type: Number,
      required: true,
      description: "The amount of the transaction or item being recorded.",
    },
    date: {
      type: Number,
      required: true,
      description:
        "The date the transaction took place (in seconds since Unix epoch)",
    },
    location: {
      type: String,
      description: "The location which the transaction took place.",
      maxlength: 128,
    },
    description: {
      type: String,
      description: "Optional description of the transaction if needed.",
      maxlength: 256,
    },
    category: {
      type: String,
      enum: [
        // Expenses
        "housing",
        "transportation",
        "food",
        "utilities",
        "healthcare",
        "insurance",
        "household supplies",
        "personal",
        "education",
        "entertainment",
        "other",
        // Income
        "salary",
        "commission",
        "bonus",
        "gifts",
        "dividend",
      ],
    },
    customCategory: {
      type: Schema.Types.ObjectId,
      description: "Reference to a custom category created by the user.",
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
