import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const errorName = error.error || "ServerError";
  const errors = error.errors || [];
  res.status(400).json({
    success: false,
    message,
    error: errorName,
    statusCode,
  });
};
