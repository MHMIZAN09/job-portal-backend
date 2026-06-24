import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { IRequestUser } from "../../types";
import { EducationService } from "./education.service";

const createEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IRequestUser;

    const { degree, institution, startDate } = req.body;
    if (!degree || !institution || !startDate) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Degree, institution, and startDate are required",
      });
    }

    const result = await EducationService.createEducation(user, req.body);

    res.status(status.CREATED).json({
      success: true,
      message: "Education added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyEducations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IRequestUser;
    const result = await EducationService.getMyEducations(user);

    res.status(status.OK).json({
      success: true,
      message: "Educations retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IRequestUser;
    const { id } = req.params;

    const result = await EducationService.updateEducation(
      user,
      id as string,
      req.body,
    );

    res.status(status.OK).json({
      success: true,
      message: "Education updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IRequestUser;
    const { id } = req.params;

    const result = await EducationService.deleteEducation(user, id as string);

    res.status(status.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const EducationController = {
  createEducation,
  getMyEducations,
  updateEducation,
  deleteEducation,
};
