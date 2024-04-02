import { Types } from "mongoose";
import { z } from "zod";

const objectIdSchema = z.custom(
  (value: unknown) => {
    if (typeof value === "string") {
      try {
        const objectId = new Types.ObjectId(value);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  },
  {
    message: "Invalid ObjectID format",
  },
);

export const sharedUsersSchema = z.object({
  userIds: z.array(objectIdSchema),
});
