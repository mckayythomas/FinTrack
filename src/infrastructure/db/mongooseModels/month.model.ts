import mongoose, { model } from "mongoose";
import { MonthSchema } from "../mongooseSchemas/month.schema";
import { IMonthDocument } from "../interfaces/IMonthDocument";

export const MonthModel =
  mongoose.models.Month || model<IMonthDocument>("Month", MonthSchema);
