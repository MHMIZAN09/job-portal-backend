import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { ExperienceController } from "./experience.controller";

const router = Router();

router.post(
  "/",
  checkAuth(Role.JOB_SEEKER),
  ExperienceController.createExperience,
);

router.get(
  "/me",
  checkAuth(Role.JOB_SEEKER),
  ExperienceController.getMyExperiences,
);

router.patch(
  "/:id",
  checkAuth(Role.JOB_SEEKER),
  ExperienceController.updateExperience,
);

router.delete(
  "/:id",
  checkAuth(Role.JOB_SEEKER),
  ExperienceController.deleteExperience,
);

export const ExperienceRoutes = router;
