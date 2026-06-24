/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { IRequestUser } from "../../types";
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

export const AuthService = {
  RegisterUser,
  LoginUser,
  getMe,
};
