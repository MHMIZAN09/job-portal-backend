import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { SkillController } from "./skill.controller";

const router = Router();
router.post("/", checkAuth(Role.ADMIN), SkillController.createSkill);
router.get("/", SkillController.getAllSkills);
router.get("/:id", SkillController.getSkillById);
router.put("/:id", checkAuth(Role.ADMIN), SkillController.updateSkill);
router.delete("/:id", checkAuth(Role.ADMIN), SkillController.deleteSkill);

export const skillRoutes = router;
