import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { IRequestUser } from "../../types";
import { JobSeekerSkillService } from "./job-seeker-skill.service";

const addSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IRequestUser;
    const { skillId, skillName } = req.body;

    if (!skillId && !skillName) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Either skillId or skillName is required",
      });
    }

    const result = await JobSeekerSkillService.addSkill(user, {
      skillId,
      skillName,
    });

    res.status(status.CREATED).json({
      success: true,
      message: "Skill added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addMultipleSkills = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IRequestUser;
    const { skillIds, skillNames } = req.body;

    if (
      (!skillIds || skillIds.length === 0) &&
      (!skillNames || skillNames.length === 0)
    ) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Provide skillIds or skillNames array",
      });
    }

    const result = await JobSeekerSkillService.addMultipleSkills(user, {
      skillIds,
      skillNames,
    });

    res.status(status.CREATED).json({
      success: true,
      message: `${result.added} skill(s) added, ${result.skipped} skipped (duplicates)`,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getMySkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IRequestUser;
    const result = await JobSeekerSkillService.getMySkills(user);

    res.status(status.OK).json({
      success: true,
      message: "Skills retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSkillsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const result = await JobSeekerSkillService.getSkillsByUserId(
      userId as string,
    );

    res.status(status.OK).json({
      success: true,
      message: "Skills retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const removeSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IRequestUser;
    const { id } = req.params;

    const result = await JobSeekerSkillService.removeSkill(user, id as string);

    res.status(status.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const JobSeekerSkillController = {
  addSkill,
  addMultipleSkills,
  getMySkills,
  getSkillsByUserId,
  removeSkill,
};
