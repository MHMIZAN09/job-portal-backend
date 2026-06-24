import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../shared/AppError";
import { IRequestUser } from "../../types";

const getMyCompany = async (user: IRequestUser) => {
  const company = await prisma.company.findUnique({
    where: { userId: user.userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phoneNumber: true,
        },
      },
      _count: {
        select: {
          jobs: true,
          reviews: true,
        },
      },
    },
  });

  if (!company) {
    throw new AppError(status.NOT_FOUND, "Company not found");
  }

  return company;
};

export const companyService = {
  getMyCompany,
};
