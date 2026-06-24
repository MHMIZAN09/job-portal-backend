import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { companyService } from "./company.service";

const getCompany = catchAsync(async (req: Request, res: Response) => {
  const company = await companyService.getMyCompany(req.user);

  res.status(200).json({
    success: true,
    message: "Company retrieved successfully",
    data: company,
  });
});

export const companyController = {
  getCompany,
};
