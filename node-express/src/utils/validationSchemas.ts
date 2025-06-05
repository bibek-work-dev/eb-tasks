import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(15),
  status: z.enum(["Active", "InActive"]).optional(),
  dateOfBirth: z.string().date(),
  hobbies: z.array(z.string()),
  bio: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(15),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
