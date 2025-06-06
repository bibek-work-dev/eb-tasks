"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (error, req, res, next) => {
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
exports.errorMiddleware = errorMiddleware;
