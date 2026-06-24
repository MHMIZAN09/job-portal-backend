/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "../shared/AppError";

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error: new AppError(status.UNAUTHORIZED, "Invalid token"),
    };
  }
};

const decodeToken = (token: string) => {
  return jwt.decode(token) as JwtPayload;
};

export const jwtUtils = {
  createToken,
  verifyToken,
  decodeToken,
};
