import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { EducationController } from "./education.controller";

const router = Router();

router.post(
  "/",
  checkAuth(Role.JOB_SEEKER),
  EducationController.createEducation,
);

router.get(
  "/me",
  checkAuth(Role.JOB_SEEKER),
  EducationController.getMyEducations,
);

router.patch(
  "/:id",
  checkAuth(Role.JOB_SEEKER),
  EducationController.updateEducation,
);

router.delete(
  "/:id",
  checkAuth(Role.JOB_SEEKER),
  EducationController.deleteEducation,
);

export const EducationRoutes = router;
