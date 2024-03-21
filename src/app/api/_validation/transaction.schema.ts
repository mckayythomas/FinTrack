import { z } from "zod";

const utcDateStringRegex =
  /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;

export const createTransactionSchema = z
  .object({
    name: z.string(),
    type: z.enum(["income", "expense"]),
    amount: z
      .number()
      .positive()
      .transform((val) => parseFloat(val.toFixed(2))),
    date: z.string().regex(utcDateStringRegex, {
      message: "Invalid UTC date format. Must be in yyyy-mm-dd format.",
    }),
    location: z.string(),
    description: z.string().optional(),
    category: z.enum([
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
      "salary",
      "commission",
      "bonus",
      "gifts",
      "dividend",
    ]),
    customCategory: z.string().optional().nullable().default(null),
    createdAt: z.number(),
    updatedAt: z.number(),
  })
  .omit({ createdAt: true, updatedAt: true });

export const updateTransactionSchema = z.object({
  name: z.string(),
  type: z.enum(["income", "expense"]),
  amount: z
    .number()
    .positive()
    .transform((val) => parseFloat(val.toFixed(2))),
  date: z.string().regex(utcDateStringRegex, {
    message: "Invalid UTC date format. Must be in yyyy-mm-dd format.",
  }),
  location: z.string(),
  description: z.string().optional(),
  category: z.enum([
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
    "salary",
    "commission",
    "bonus",
    "gifts",
    "dividend",
  ]),
  customCategory: z.string().optional().nullable().default(null),
});
