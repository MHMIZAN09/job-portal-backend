/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
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

  return {
    ...data,
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

  return {
    ...data,
  };
};

const getMe = async (user: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
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
