import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const zodValidate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log("result", result);
    if (result.error) {
      const combinedMessage: string = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      res.status(400).json({
        success: false,
        statusCode: 400,
        message: combinedMessage || "Something went wrong",
        error: "BadRequest",
      });
    }

    req.body = result.data;
    next();
  };
};
