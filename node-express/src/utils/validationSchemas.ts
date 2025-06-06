import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(5).max(20),
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

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6).max(15),
  confirmPassword: z.string().min(6).max(15),
  code: z.string().length(6),
  userId: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
