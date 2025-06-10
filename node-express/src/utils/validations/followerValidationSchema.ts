import { z } from "zod";

export const sendFollowRequestSchema = z.object({
  followingId: z.string().nonempty("Following ID is required"),
});

export const respondToFollowRequestSchema = z.object({
  followerId: z.string().nonempty("User ID is required"),
  status: z.enum(["ACCEPTED", "REJECTED"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

export type typeSendFollowRequestSchema = z.infer<
  typeof sendFollowRequestSchema
>;
export type typeRespondToFollowRequestSchema = z.infer<
  typeof respondToFollowRequestSchema
>;
