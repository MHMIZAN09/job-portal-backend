/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/enums";
import { envVars } from "../../config";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { IRequestUser } from "../../types";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";
import { IUserLoginPayload, IUserRegisterPayload } from "./auth.interface";

const RegisterUser = async (payload: IUserRegisterPayload) => {
  const { name, email, password, role, companyName, industry } = payload;

  if (role === Role.EMPLOYER && (!companyName || !industry)) {
    throw new AppError(
      status.BAD_REQUEST,
      "Company name and industry are required for employers",
    );
  }
  if (role === Role.ADMIN) {
    throw new AppError(
      status.FORBIDDEN,
      "Admin accounts cannot be created through registration",
    );
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!data.user) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to register user");
  }
  try {
    await prisma.$transaction(async (tx) => {
      if (role !== Role.JOB_SEEKER) {
        await tx.user.update({
          where: { id: data.user.id },
          data: { role },
        });
      }

      if (role === Role.JOB_SEEKER) {
        await tx.jobSeekerProfile.create({
          data: {
            userId: data.user.id,
          },
        });
      }

      if (role === Role.EMPLOYER) {
        await tx.company.create({
          data: {
            userId: data.user.id,
            companyName: companyName!.trim(),
            industry: industry!.trim(),
          },
        });
      }
    });
  } catch (error: any) {
    await prisma.user.delete({ where: { id: data.user.id } });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to complete registration",
    );
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: {
      profile: true,
      company: true,
    },
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    emailVerified: data.user.emailVerified,
  });

  return {
    user: fullUser,
    token: data.token,
    accessToken,
    refreshToken,
  };
};

const LoginUser = async (payload: IUserLoginPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (!data.user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
  }
  const fullUser = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: {
      profile: true,
      company: true,
    },
  });

  // Check active
  if (!fullUser?.isActive) {
    throw new AppError(status.FORBIDDEN, "Your account is deactivated");
  }

  if (fullUser.isDeleted) {
    throw new AppError(status.FORBIDDEN, "Your account is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    emailVerified: data.user.emailVerified,
  });

  return {
    user: fullUser,
    token: data.token,
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      profile: true,
      company: true,
    },
  });

  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  return userData;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );
  // console.log(verifiedRefreshToken);
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};
export const AuthService = {
  RegisterUser,
  LoginUser,
  getMe,
  getNewToken,
};
