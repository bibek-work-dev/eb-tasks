import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("error", error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const errorName = error.error || "ServerError";
  const errors = error.errors || [];
  res.status(statusCode).json({
    success: false,
    message,
    error: errorName,
    statusCode,
  });
};
