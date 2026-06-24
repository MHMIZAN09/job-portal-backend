/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { IRequestUser } from "../../types";
import {
  ICreateExperiencePayload,
  IUpdateExperiencePayload,
} from "./experience.interface";

const getProfileId = async (userId: string): Promise<string> => {
  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new AppError(
      status.NOT_FOUND,
      "Job seeker profile not found. Please create profile first."
    );
  }

  return profile.id;
};


const createExperience = async (
  user: IRequestUser,
  payload: ICreateExperiencePayload
) => {
  const jobSeekerId = await getProfileId(user.userId);

  // Validate dates
  const startDate = new Date(payload.startDate);
  const endDate = payload.endDate ? new Date(payload.endDate) : null;

  if (endDate && startDate > endDate) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start date must be before end date"
    );
  }


  if (startDate > new Date()) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start date cannot be in the future"
    );
  }

  const experience = await prisma.experience.create({
    data: {
      jobSeekerId,
      companyName: payload.companyName,
      position: payload.position,
      startDate,
      endDate,
      description: payload.description,
    },
  });

  return experience;
};


const getMyExperiences = async (user: IRequestUser) => {
  const jobSeekerId = await getProfileId(user.userId);

  const experiences = await prisma.experience.findMany({
    where: { jobSeekerId },
    orderBy: { startDate: "desc" }, // Latest first
  });

  return experiences;
};


const updateExperience = async (
  user: IRequestUser,
  experienceId: string,
  payload: IUpdateExperiencePayload
) => {
  const jobSeekerId = await getProfileId(user.userId);


  const existingExperience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      jobSeekerId,
    },
  });

  if (!existingExperience) {
    throw new AppError(
      status.NOT_FOUND,
      "Experience not found or you don't have permission to update it"
    );
  }

  // Prepare update data
  const updateData: any = { ...payload };

  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }
  if (payload.endDate) {
    updateData.endDate = new Date(payload.endDate);
  }

  // Validate dates if both provided
  const finalStartDate = updateData.startDate || existingExperience.startDate;
  const finalEndDate =
    updateData.endDate !== undefined
      ? updateData.endDate
      : existingExperience.endDate;

  if (finalEndDate && finalStartDate > finalEndDate) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start date must be before end date"
    );
  }

  // Start date cannot be in future
  if (finalStartDate > new Date()) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start date cannot be in the future"
    );
  }

  const updated = await prisma.experience.update({
    where: { id: experienceId },
    data: updateData,
  });

  return updated;
};


const deleteExperience = async (
  user: IRequestUser,
  experienceId: string
) => {
  const jobSeekerId = await getProfileId(user.userId);

  const existingExperience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      jobSeekerId,
    },
  });

  if (!existingExperience) {
    throw new AppError(
      status.NOT_FOUND,
      "Experience not found or you don't have permission to delete it"
    );
  }

  await prisma.experience.delete({
    where: { id: experienceId },
  });

  return { message: "Experience deleted successfully" };
};

export const ExperienceService = {
  createExperience,
  getMyExperiences,
  updateExperience,
  deleteExperience,
};
