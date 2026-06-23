import { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

type ErrorWithStatus = Error & {
  status?: number | "fail" | "error";
  statusCode?: number;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const error = err as ErrorWithStatus;
  const statusCode =
    error.statusCode ?? (typeof error.status === "number" ? error.status : 500);
  const message = error.message || "Something went wrong";
  const status = err instanceof AppError ? err.status : "error";

  res.status(statusCode).json({
    success: false,
    status,
    message,
    path: req.originalUrl,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export default globalErrorHandler;
