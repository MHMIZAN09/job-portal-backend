import { Response } from "express";

interface ResponsePayload<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

const sendResponse = <T>(
  res: Response,
  { statusCode, success, message, data, meta }: ResponsePayload<T>,
): void => {
  res.status(statusCode).json({
    success,
    message,
    ...(meta && { meta }),
    ...(data !== undefined && { data }),
  });
};

export default sendResponse;
