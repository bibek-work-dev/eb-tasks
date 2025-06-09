import z from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
  imageUrl: z.string(),
});

export const updatePostSchema = createPostSchema.partial();

export type typeCreatePostSchema = z.infer<typeof createPostSchema>;
export type typeUpdatePostSchema = z.infer<typeof updatePostSchema>;
