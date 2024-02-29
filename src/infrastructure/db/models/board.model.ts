import mongoose, { model } from "mongoose";
import { BoardSchema } from "../schemas/board.schema";
import { IBoardDocument } from "../interfaces/IBoardDocument";

export const BoardModel = model<IBoardDocument>("Board", BoardSchema);
