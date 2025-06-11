import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.coerce.date({
      required_error: "Start date is required",
      invalid_type_error: "Invalid start date",
    }),
    endDate: z.coerce.date({
      required_error: "End date is required",
      invalid_type_error: "Invalid end date",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type typeCreateEventSchema = z.infer<typeof createEventSchema>;
