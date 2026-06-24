import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { SkillService } from "./skill.service";

const createSkill = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const skill = await SkillService.createSkill({ ...req.body, userId });
  res.status(status.CREATED).json({
    success: true,
    message: "Skill created successfully",
    data: skill,
  });
});

const getAllSkills = catchAsync(async (req, res) => {
  const skills = await SkillService.getAllSkills();
  res.status(status.OK).json({
    success: true,
    message: "Skills retrieved successfully",
    data: skills,
  });
});

const getSkillById = catchAsync(async (req, res) => {
  const skill = await SkillService.getSkillById(req.params.id as string);
  res.status(status.OK).json({
    success: true,
    message: "Skill retrieved successfully",
    data: skill,
  });
});

const updateSkill = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const skill = await SkillService.updateSkill(req.params.id as string, {
    ...req.body,
    userId,
  });
  res.status(status.OK).json({
    success: true,
    message: "Skill updated successfully",
    data: skill,
  });
});

const deleteSkill = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await SkillService.deleteSkill(
    req.params.id as string,
    userId,
  );
  res.status(status.OK).json({
    success: true,
    message: result.message,
  });
});

export const SkillController = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
