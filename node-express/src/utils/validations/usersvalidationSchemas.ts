import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(5).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(15),
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

export const updateProfileSchema = z.object({
  name: z.string().min(5).max(20).optional(),
  dateOfBirth: z.string().date().optional(),
  hobbies: z.array(z.string()).optional(),
  bio: z.string().optional().optional(),
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

export const changePassswordSchema = z.object({
  newPassword: z.string().min(6).max(15),
});

export type typeRegisterInput = z.infer<typeof registerSchema>;
export type typeLoginInput = z.infer<typeof loginSchema>;
export type typeVerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type typeChangePasswordInput = z.infer<typeof changePassswordSchema>;
export type typeUpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type typeForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type typeResetPasswordInput = z.infer<typeof resetPasswordSchema>;
