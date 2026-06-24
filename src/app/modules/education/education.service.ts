/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { IRequestUser } from "../../types";
import {
  ICreateEducationPayload,
  IUpdateEducationPayload,
} from "./education.interface";

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

const createEducation = async (
  user: IRequestUser,
  payload: ICreateEducationPayload,
) => {
  const jobSeekerId = await getProfileId(user.userId);

  const startDate = new Date(payload.startDate);
  const endDate = payload.endDate ? new Date(payload.endDate) : null;

  if (endDate && startDate > endDate) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start date must be before end date",
    );
  }

  // Validate CGPA range
  if (payload.cgpa !== undefined && (payload.cgpa < 0 || payload.cgpa > 4)) {
    throw new AppError(status.BAD_REQUEST, "CGPA must be between 0 and 4");
  }

  const education = await prisma.education.create({
    data: {
      jobSeekerId,
      degree: payload.degree,
      institution: payload.institution,
      fieldOfStudy: payload.fieldOfStudy,
      startDate,
      endDate,
      cgpa: payload.cgpa,
    },
  });

  return education;
};


const getMyEducations = async (user: IRequestUser) => {
  const jobSeekerId = await getProfileId(user.userId);

  const educations = await prisma.education.findMany({
    where: { jobSeekerId },
    orderBy: { startDate: "desc" }, // Latest first
  });

  return educations;
};

const updateEducation = async (
  user: IRequestUser,
  educationId: string,
  payload: IUpdateEducationPayload,
) => {
  const jobSeekerId = await getProfileId(user.userId);


  const existingEducation = await prisma.education.findFirst({
    where: {
      id: educationId,
      jobSeekerId,
    },
  });

  if (!existingEducation) {
    throw new AppError(
      status.NOT_FOUND,
      "Education not found or you don't have permission to update it",
    );
  }


  const updateData: any = { ...payload };

  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }
  if (payload.endDate) {
    updateData.endDate = new Date(payload.endDate);
  }


  const finalStartDate = updateData.startDate || existingEducation.startDate;
  const finalEndDate = updateData.endDate || existingEducation.endDate;

  if (finalEndDate && finalStartDate > finalEndDate) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start date must be before end date",
    );
  }


  if (payload.cgpa !== undefined && (payload.cgpa < 0 || payload.cgpa > 4)) {
    throw new AppError(status.BAD_REQUEST, "CGPA must be between 0 and 4");
  }

  const updated = await prisma.education.update({
    where: { id: educationId },
    data: updateData,
  });

  return updated;
};

const deleteEducation = async (user: IRequestUser, educationId: string) => {
  const jobSeekerId = await getProfileId(user.userId);


  const existingEducation = await prisma.education.findFirst({
    where: {
      id: educationId,
      jobSeekerId,
    },
  });

  if (!existingEducation) {
    throw new AppError(
      status.NOT_FOUND,
      "Education not found or you don't have permission to delete it",
    );
  }

  await prisma.education.delete({
    where: { id: educationId },
  });

  return { message: "Education deleted successfully" };
};

export const EducationService = {
  createEducation,
  getMyEducations,
  updateEducation,
  deleteEducation,
};
