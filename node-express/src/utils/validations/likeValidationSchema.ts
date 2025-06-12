import z from "zod";

export const likeCreateSchema = z.object({});

export type typeLikeCreateSchema = z.infer<typeof likeCreateSchema>;
