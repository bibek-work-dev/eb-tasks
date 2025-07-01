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

export const updateSchema = registerSchema
  .extend({ id: z.string() })
  .omit({ email: true })
  .partial();

export const deleteSchema = z.object({
  id: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type DeleteInput = z.infer<typeof deleteSchema>;
