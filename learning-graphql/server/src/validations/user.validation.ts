import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name is required").max(12, "max 12 character"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 character"),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 character"),
});

export const updateSchema = registerSchema.omit({ email: true }).partial();

export const deleteSchema = z.object({
  id: z.string(),
});

export type TypeRegisterInput = z.infer<typeof registerSchema>;
export type TypeLoginInput = z.infer<typeof loginSchema>;
export type TypeUpdateInput = z.infer<typeof updateSchema>;
export type TypeDeleteInput = z.infer<typeof deleteSchema>;
