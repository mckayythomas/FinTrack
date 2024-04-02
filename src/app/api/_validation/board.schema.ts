import { z } from "zod";

const sharedUserSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  accessLevel: z.enum(["view-only", "contributor"]),
});

export const createBoardSchema = z
  .object({
    name: z.string({
      required_error: "name field is required",
      invalid_type_error: "name must be a string",
    }),
    description: z
      .string({ invalid_type_error: "description must be a string" })
      .optional()
      .default(""),
    privacy: z.enum(["private", "shared"]).default("private"),
    sharedUsers: z.array(sharedUserSchema).optional().default([]),
    createdAt: z.never(),
    updatedAt: z.never(),
  })
  .omit({ createdAt: true, updatedAt: true });

export const updateBoardSchema = z.object({
  name: z.string(),
  description: z.string().optional().default(""),
});

export const shareBoardWithUserSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    accessLevel: z.literal("view-only").or(z.literal("contributor")),
  })
  .refine(
    (data) => {
      const { email, name } = data;
      return (
        (email === undefined) !== (name === undefined) &&
        (email !== undefined || name !== undefined)
      );
    },
    {
      message: "You must provide either an email or a name, but not both.",
      path: [],
    },
  );

export const unshareBoardWithUserSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().optional(),
  })
  .refine(
    (data) => {
      const { email, name } = data;
      return (
        ((email === undefined) !== (name === undefined) &&
          email !== undefined) ||
        name !== undefined
      );
    },
    {
      message: "You must provide either an email or a name, but not both.",
      path: [],
    },
  );
