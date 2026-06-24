import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { jobSeekerRoutes } from "../modules/jobSeeker/jobSeeker.route";

const router = Router();
router.use("/auth", authRoutes);
router.use("/job-seeker", jobSeekerRoutes);
export const IndexRoutes = router;
