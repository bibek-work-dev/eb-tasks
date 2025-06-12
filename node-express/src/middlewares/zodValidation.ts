import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const zodValidate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log("req. body in zodvalidation", result);
    if (result.error) {
      console.log("result", result.error.errors);
      const combinedMessage: string = result.error.errors
        .map((err) => {
          const path = err.path.join(".");
          // If path is empty (e.g., missing top-level fields), default to generic
          const label = path || "Field";
          return `${label}: ${err.message}`;
        })
        .join(", ");

      console.log("combinedMessage", combinedMessage);

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
