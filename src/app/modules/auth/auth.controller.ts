import { Request, Response } from "express";
import status from "http-status";
import { AuthService } from "./auth.service";

const Register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.RegisterUser(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to register user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const Login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.LoginUser(req.body);
    res.status(status.OK).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({
      success: false,
      message: "Invalid email or password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await AuthService.getMe(user);
    res.status(status.OK).json({
      success: true,
      message: "User data retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(status.NOT_FOUND).json({
      success: false,
      message: "User not found",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const AuthController = {
  Register,
  Login,
  getMe,
};
