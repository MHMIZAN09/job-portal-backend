import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { companyController } from "./company.controller";

const router = Router();

router.get("/", checkAuth(Role.EMPLOYER), companyController.getCompany);

export const companyRoutes = router;
