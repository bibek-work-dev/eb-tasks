import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const zodValidate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log("result", result);
    if (result.error) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        errors: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
        message: "Something went wrong",
        error: "BadRequest",
      });
    }

    req.body = result.data;
    next();
  };
};
