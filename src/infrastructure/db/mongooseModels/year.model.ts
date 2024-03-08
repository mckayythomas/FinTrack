import mongoose, { model } from "mongoose";
import { YearSchema } from "../mongooseSchemas/year.schema";
import { IYearDocument } from "../interfaces/IYearDocument";

export const YearModel =
  mongoose.models.Year || model<IYearDocument>("Year", YearSchema);
