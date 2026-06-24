import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { ICreateSkillPayload } from "./skill.interface";

const createSkill = async (payload: ICreateSkillPayload) => {
  const isAdmin = await prisma.user.findFirst({
    where: {
      id: payload.userId,
    },
  });
  if (!isAdmin) {
    throw new AppError(status.FORBIDDEN, "Only admins can create skills");
  }
  const skillName = payload.name.trim();
  if (!skillName) {
    throw new AppError(status.BAD_REQUEST, "Skill name cannot be empty");
  }

  const existingSkill = await prisma.skill.findFirst({
    where: {
      name: {
        equals: skillName,
        mode: "insensitive",
      },
    },
  });
  if (existingSkill) {
    throw new AppError(
      status.CONFLICT,
      `Skill with this name "${skillName}" already exists`,
    );
  }

  const skill = await prisma.skill.create({
    data: {
      name: skillName,
    },
  });
  return skill;
};

const getAllSkills = async () => {
  const skills = await prisma.skill.findMany();
  return skills;
};

const getSkillById = async (id: string) => {
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
  if (!skill) {
    throw new AppError(status.NOT_FOUND, "Skill not found");
  }
  return skill;
};

const updateSkill = async (id: string, payload: ICreateSkillPayload) => {
  const isAdmin = await prisma.user.findFirst({
    where: {
      id: payload.userId,
    },
  });
  if (!isAdmin) {
    throw new AppError(status.FORBIDDEN, "Only admins can update skills");
  }
  const exist = await prisma.skill.findUnique({
    where: { id },
  });
  if (!exist) {
    throw new AppError(status.NOT_FOUND, "Skill not found");
  }
  if (payload.name) {
    const newName = payload.name.trim();

    if (!newName) {
      throw new AppError(status.BAD_REQUEST, "Skill name cannot be empty");
    }

    const duplicateSkill = await prisma.skill.findFirst({
      where: {
        name: {
          equals: newName,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });
    if (duplicateSkill) {
      throw new AppError(
        status.CONFLICT,
        `Skill with this name "${newName}" already exists`,
      );
    }
  }
  const updatedSkill = await prisma.skill.update({
    where: { id },
    data: payload,
  });
  return updatedSkill;
};

const deleteSkill = async (id: string, userId: string) => {
  const isAdmin = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!isAdmin) {
    throw new AppError(status.FORBIDDEN, "Only admins can delete skills");
  }
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true } },
    },
  });

  if (!skill) {
    throw new AppError(status.NOT_FOUND, "Skill not found");
  }

  if (skill._count.users > 0) {
    throw new AppError(
      status.CONFLICT,
      `Cannot delete skill "${skill.name}" - it is used by ${skill._count.users} user(s)`,
    );
  }

  await prisma.skill.delete({
    where: { id },
  });

  return { message: `Skill "${skill.name}" deleted successfully` };
};

export const SkillService = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
