import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";

const Register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.RegisterUser(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookies(res, token as string);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const Login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.LoginUser(req.body);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookies(res, token as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const AuthController = {
  Register,
  Login,
  getMe,
};
