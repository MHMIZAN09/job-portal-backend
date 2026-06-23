import { NextFunction, Request, Response } from "express";
import status from "http-status";
import AppError from "../utils/AppError";

const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      status.NOT_FOUND,
      `Cannot find ${req.originalUrl} on this server!`,
    ),
  );
};

export default notFound;
