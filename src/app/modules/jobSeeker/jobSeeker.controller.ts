import { NextFunction, Request, Response } from "express";
import status from "http-status";

import { IRequestUser } from "../../types";
import { ProfileService } from "./jobSeeker.service";


const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IRequestUser;
    const result = await ProfileService.getMyProfile(user);

    res.status(status.OK).json({
      success: true,
      message: "Profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const getProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const result = await ProfileService.getProfileByUserId(userId as string);

    res.status(status.OK).json({
      success: true,
      message: "Profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IRequestUser;
    const result = await ProfileService.updateMyProfile(user, req.body);

    res.status(status.OK).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const JobSeekerController = {
  getMyProfile,
  getProfileByUserId,
  updateMyProfile,
};
