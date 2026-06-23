import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.Register);
router.post("/login", AuthController.Login);
router.get("/me", AuthController.getMe);

export const authRoutes = router;
