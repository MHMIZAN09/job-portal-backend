import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.Register);
router.post("/login", AuthController.Login);
router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.EMPLOYER, Role.JOB_SEEKER),
  AuthController.getMe,
);

router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.EMPLOYER, Role.JOB_SEEKER),
  AuthController.changePassword,
);

router.post("/refresh-token", AuthController.getNewToken);

router.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.EMPLOYER, Role.JOB_SEEKER),
  AuthController.logoutUser,
);

router.post("/verify-email", AuthController.verifyEmail);
export const authRoutes = router;
