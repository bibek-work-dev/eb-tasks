import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const zodValidate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log("result", result);
    if (result.error) {
      res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    next();
  };
};
