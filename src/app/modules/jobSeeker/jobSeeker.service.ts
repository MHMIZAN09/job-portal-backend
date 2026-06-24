/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { IRequestUser } from "../../types";
import { IUpdateProfilePayload } from "./jobSeeker.interface";

const getMyProfile = async (user: IRequestUser) => {
  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId: user.userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phoneNumber: true,
          role: true,
          emailVerified: true,
          isActive: true,
          createdAt: true,
        },
      },
      educations: {
        orderBy: { startDate: "desc" },
      },
      experiences: {
        orderBy: { startDate: "desc" },
      },
      skills: {
        include: { skill: true },
      },
    },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Profile not found");
  }

  return profile;
};

const getProfileByUserId = async (userId: string) => {
  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      educations: {
        orderBy: { startDate: "desc" },
      },
      experiences: {
        orderBy: { startDate: "desc" },
      },
      skills: {
        include: { skill: true },
      },
    },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Profile not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true, isDeleted: true },
  });

  if (!user || !user.isActive || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Profile not available");
  }

  return profile;
};

const updateMyProfile = async (
  user: IRequestUser,
  payload: IUpdateProfilePayload,
) => {

  const existingProfile = await prisma.jobSeekerProfile.findUnique({
    where: { userId: user.userId },
  });

  if (!existingProfile) {
    throw new AppError(status.NOT_FOUND, "Profile not found");
  }


  const updateData: any = { ...payload };
  if (payload.dateOfBirth) {
    updateData.dateOfBirth = new Date(payload.dateOfBirth);
  }

  const updated = await prisma.jobSeekerProfile.update({
    where: { userId: user.userId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phoneNumber: true,
          role: true,
        },
      },
      educations: true,
      experiences: true,
      skills: { include: { skill: true } },
    },
  });

  return updated;
};

export const ProfileService = {
  getMyProfile,
  getProfileByUserId,
  updateMyProfile,
};
