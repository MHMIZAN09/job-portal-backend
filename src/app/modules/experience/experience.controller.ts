/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { IRequestUser } from "../../types";
import { ExperienceService } from "./experience.service";

const createExperience = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IRequestUser;
    const payload = req.body;

    const result = await ExperienceService.createExperience(user, payload);

    res.status(status.CREATED).json({
      success: true,
      message: "Experience created successfully",
      data: result,
    });
  },
);

const getMyExperiences = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IRequestUser;

    const result = await ExperienceService.getMyExperiences(user);

    res.status(status.OK).json({
      success: true,
      message: "Experiences fetched successfully",
      data: result,
    });
  },
);

const updateExperience = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IRequestUser;
    const { id } = req.params;

    const result = await ExperienceService.updateExperience(
      user,
      id as string,
      req.body,
    );

    res.status(status.OK).json({
      success: true,
      message: "Experience updated successfully",
      data: result,
    });
  },
);

const deleteExperience = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IRequestUser;
    const { id } = req.params;

    const result = await ExperienceService.deleteExperience(user, id as string);

    res.status(status.OK).json({
      success: true,
      message: result.message,
    });
  },
);

export const ExperienceController = {
  createExperience,
  getMyExperiences,
  updateExperience,
  deleteExperience,
};
