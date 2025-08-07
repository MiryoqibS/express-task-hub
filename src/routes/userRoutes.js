import { Router } from "express";
import { register, login, getProfile, logout } from "../controllers/userController.js";
const router = Router();

router.post("/api/register", register);
router.post("/api/login", login);
router.get("/api/profile", getProfile);
router.get("/api/logout", logout);

export default router;
