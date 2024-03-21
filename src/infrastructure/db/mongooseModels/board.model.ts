import mongoose, { model } from "mongoose";
import { BoardSchema } from "../mongooseSchemas/board.schema";
import { IBoardDocument } from "../interfaces/IBoardDocument";

export const BoardModel =
  mongoose.models.Board || model<IBoardDocument>("Board", BoardSchema);
