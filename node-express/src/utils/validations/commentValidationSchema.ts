import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(10, "Comment too long"),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(10, "Comment too long"),
});

export type typeCreateCommentInput = z.infer<typeof createCommentSchema>;
export type typeUpdateCommentInput = z.infer<typeof updateCommentSchema>;
