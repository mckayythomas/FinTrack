import { z } from "zod";

const SharedUserSchema = z.object({
  userId: z.string(),
  accessLevel: z.enum(["view-only", "contributor"]),
});

export const createBoardSchema = z
  .object({
    _id: z.string().optional(),
    userId: z.string(),
    name: z.string(),
    description: z.string().optional().default(""),
    privacy: z.enum(["private", "shared"]).default("private"),
    sharedUsers: z.array(SharedUserSchema).optional().default([]),
    createdAt: z.number(),
    updatedAt: z.number(),
  })
  .omit({ createdAt: true, updatedAt: true });

export const updateBoardSchema = z.object({
  name: z.string(),
  description: z.string().optional().default(""),
});
