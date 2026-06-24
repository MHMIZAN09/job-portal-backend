import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { JobSeekerController } from "./jobSeeker.controller";

const router = Router();

router.get("/me", checkAuth(Role.JOB_SEEKER), JobSeekerController.getMyProfile);
router.get(
  "/:userId",

  JobSeekerController.getProfileByUserId,
);
router.patch(
  "/me",
  checkAuth(Role.JOB_SEEKER),
  JobSeekerController.updateMyProfile,
);

export const jobSeekerRoutes = router;
