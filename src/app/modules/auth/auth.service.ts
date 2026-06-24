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
  const { name, email, password } = payload;
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
    if (data.user.role === Role.JOB_SEEKER) {
      await prisma.jobSeekerProfile.create({
        data: {
          userId: data.user.id,
        },
      });
    }
  } catch (error: any) {
    await prisma.user.delete({ where: { id: data.user.id } });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create profile",
    );
  }

  const userWithProfile = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: {
      profile: true,
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
    ...data,
    token: data.token,
    accessToken,
    refreshToken,
    user: userWithProfile,
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
  const userWithProfile = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: {
      profile: true,
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
    ...data,
    token: data.token,
    accessToken,
    refreshToken,
    user: userWithProfile,
  };
};

const getMe = async (user: IRequestUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      profile: true,
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
