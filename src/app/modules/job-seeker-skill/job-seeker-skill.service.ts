import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { IRequestUser } from "../../types";
import {
  IAddMultipleSkillsPayload,
  IAddSkillPayload,
} from "./job-seeker-skill.interface";


const getProfileId = async (userId: string): Promise<string> => {
  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new AppError(
      status.NOT_FOUND,
      "Job seeker profile not found. Please create profile first.",
    );
  }

  return profile.id;
};


const addSkill = async (user: IRequestUser, payload: IAddSkillPayload) => {
  const profileId = await getProfileId(user.userId);
  let skillId = payload.skillId;

  if (!skillId && payload.skillName) {
    const skillName = payload.skillName.trim();

    if (!skillName) {
      throw new AppError(status.BAD_REQUEST, "Skill name cannot be empty");
    }

    let skill = await prisma.skill.findFirst({
      where: {
        name: { equals: skillName, mode: "insensitive" },
      },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: { name: skillName },
      });
    }

    skillId = skill.id;
  }

  if (!skillId) {
    throw new AppError(
      status.BAD_REQUEST,
      "Either skillId or skillName is required",
    );
  }


  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) {
    throw new AppError(status.NOT_FOUND, "Skill not found");
  }


  const existing = await prisma.jobSeekerSkill.findFirst({
    where: { profileId, skillId },
  });

  if (existing) {
    throw new AppError(
      status.CONFLICT,
      `You already have "${skill.name}" in your skills`,
    );
  }


  const jobSeekerSkill = await prisma.jobSeekerSkill.create({
    data: { profileId, skillId },
    include: { skill: true },
  });

  return jobSeekerSkill;
};


const addMultipleSkills = async (
  user: IRequestUser,
  payload: IAddMultipleSkillsPayload,
) => {
  const profileId = await getProfileId(user.userId);

  const skillIds: string[] = [];

  // Handle skill names (find or create)
  if (payload.skillNames && payload.skillNames.length > 0) {
    for (const name of payload.skillNames) {
      const trimmedName = name.trim();
      if (!trimmedName) continue;

      let skill = await prisma.skill.findFirst({
        where: { name: { equals: trimmedName, mode: "insensitive" } },
      });

      if (!skill) {
        skill = await prisma.skill.create({ data: { name: trimmedName } });
      }

      skillIds.push(skill.id);
    }
  }

  // Handle skill IDs
  if (payload.skillIds && payload.skillIds.length > 0) {
    skillIds.push(...payload.skillIds);
  }

  if (skillIds.length === 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "Provide at least one skillId or skillName",
    );
  }

  // Remove duplicates
  const uniqueSkillIds = [...new Set(skillIds)];

  // Get existing user skills (to avoid duplicates)
  const existingSkills = await prisma.jobSeekerSkill.findMany({
    where: {
      profileId,
      skillId: { in: uniqueSkillIds },
    },
    select: { skillId: true },
  });

  const existingSkillIds = existingSkills.map((s) => s.skillId);
  const newSkillIds = uniqueSkillIds.filter(
    (id) => !existingSkillIds.includes(id),
  );

  if (newSkillIds.length === 0) {
    throw new AppError(
      status.CONFLICT,
      "All provided skills are already added",
    );
  }

  // Bulk create
  await prisma.jobSeekerSkill.createMany({
    data: newSkillIds.map((skillId) => ({ profileId, skillId })),
  });

  // Return added skills
  const added = await prisma.jobSeekerSkill.findMany({
    where: {
      profileId,
      skillId: { in: newSkillIds },
    },
    include: { skill: true },
  });

  return {
    added: added.length,
    skipped: existingSkillIds.length,
    data: added,
  };
};


const getMySkills = async (user: IRequestUser) => {
  const profileId = await getProfileId(user.userId);

  const skills = await prisma.jobSeekerSkill.findMany({
    where: { profileId },
    include: { skill: true },
    orderBy: { createdAt: "desc" },
  });

  return skills;
};

const getSkillsByUserId = async (userId: string) => {
  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Profile not found");
  }

  const skills = await prisma.jobSeekerSkill.findMany({
    where: { profileId: profile.id },
    include: { skill: true },
    orderBy: { createdAt: "desc" },
  });

  return skills;
};


const removeSkill = async (user: IRequestUser, jobSeekerSkillId: string) => {
  const profileId = await getProfileId(user.userId);

  // ✅ Check ownership
  const skill = await prisma.jobSeekerSkill.findFirst({
    where: {
      id: jobSeekerSkillId,
      profileId, // Make sure it belongs to this user
    },
    include: { skill: true },
  });

  if (!skill) {
    throw new AppError(
      status.NOT_FOUND,
      "Skill not found in your profile or you don't have permission",
    );
  }

  await prisma.jobSeekerSkill.delete({
    where: { id: jobSeekerSkillId },
  });

  return {
    message: `Skill "${skill.skill.name}" removed successfully`,
  };
};

export const JobSeekerSkillService = {
  addSkill,
  addMultipleSkills,
  getMySkills,
  getSkillsByUserId,
  removeSkill,
};
