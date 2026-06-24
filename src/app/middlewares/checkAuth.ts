import { NextFunction, Request, Response } from "express";
import status from "http-status";

import { prisma } from "../lib/prisma";

import { Role } from "../../generated/prisma/enums";
import { envVars } from "../config";
import AppError from "../shared/AppError";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Implementation for checking authentication and authorization
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new Error("Unauthorized: No session token found");
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const presentRemaining = (timeRemaining / sessionLifetime) * 100;

          if (presentRemaining < 20) {
            res.setHeader("X-Session-Expiring", "true");
            res.setHeader("X-Session-Expires-In", expiresAt.toISOString());
            res.setHeader("X-Session-Remaining", timeRemaining.toString());

            console.log(
              `Session is expiring soon. Remaining time: ${timeRemaining} ms`,
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden: You do not have access to this resource",
            );
          }
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
          };
        }
      }

      const accessToken = await cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized ");
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access to this resource",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
