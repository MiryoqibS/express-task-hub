import { Router } from "express";
import { register, login, getProfile, logout, getUserFriends, acceptFriendRequest, sendFriendRequest, getUserRequests } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/api/register", register);
router.post("/api/login", login);
router.get("/api/profile", getProfile);
router.get("/api/logout",  logout);

router.get("/api/user/friends", authMiddleware, getUserFriends);
router.post("/api/user/friends/send/:id", authMiddleware, sendFriendRequest)
router.post("/api/user/friends/accept/:id", authMiddleware, acceptFriendRequest);
router.get("/api/user/friends/requests", authMiddleware, getUserRequests)

export default router;
