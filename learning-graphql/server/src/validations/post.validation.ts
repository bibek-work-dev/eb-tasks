import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Name is required").max(20, "max 20 character"),
  description: z.string().min(3, "Less than 3 letter not allowed"),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().min(1, "Post ID is required"),
});

export const deletePostSchema = z.object({
  id: z.string().min(1, "Post ID is required"),
});

export type TypeCreatePostSchema = z.infer<typeof createPostSchema>;
export type TypeUpdatePostSchema = z.infer<typeof updatePostSchema>;
export type TypeDeletePostSchema = z.infer<typeof deletePostSchema>;
