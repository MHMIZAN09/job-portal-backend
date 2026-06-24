import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { JobSeekerSkillController } from "./job-seeker-skill.controller";

const router = Router();

router.get("/user/:userId", JobSeekerSkillController.getSkillsByUserId);

router.post("/", checkAuth(Role.JOB_SEEKER), JobSeekerSkillController.addSkill);

router.post(
  "/bulk",
  checkAuth(Role.JOB_SEEKER),
  JobSeekerSkillController.addMultipleSkills,
);

router.get(
  "/",
  checkAuth(Role.JOB_SEEKER),
  JobSeekerSkillController.getMySkills,
);

router.delete(
  "/:id",
  checkAuth(Role.JOB_SEEKER),
  JobSeekerSkillController.removeSkill,
);

export const JobSeekerSkillRoutes = router;
