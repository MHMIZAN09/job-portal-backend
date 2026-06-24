import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { EducationRoutes } from "../modules/education/education.route";
import { ExperienceRoutes } from "../modules/experience/experience.route";
import { JobSeekerSkillRoutes } from "../modules/job-seeker-skill/job-seeker-skill.route";
import { jobSeekerRoutes } from "../modules/jobSeeker/jobSeeker.route";
import { skillRoutes } from "../modules/skill/skill.route";

const router = Router();
router.use("/auth", authRoutes);
router.use("/job-seeker", jobSeekerRoutes);
router.use("/education", EducationRoutes);
router.use("/experience", ExperienceRoutes);
router.use("/skill", skillRoutes);
router.use("/my-skills", JobSeekerSkillRoutes);
export const IndexRoutes = router;
