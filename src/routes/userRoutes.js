import { Router } from "express";
import { register, login, getProfile, logout, getUserFriends, acceptFriendRequest, sendFriendRequest, getUserRequests, rejectFriendRequest, removeUserFriend } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/api/user/register", register);
router.post("/api/user/login", login);
router.get("/api/user/profile", authMiddleware, getProfile);
router.get("/api/user/profile/:id", getProfile);
router.get("/api/user/logout", logout);

router.get("/api/user/friends", authMiddleware, getUserFriends);
router.delete("/api/user/friends/:id", authMiddleware, removeUserFriend);
router.get("/api/user/friends/requests", authMiddleware, getUserRequests);
router.post("/api/user/friends/send/:id", authMiddleware, sendFriendRequest);
router.post("/api/user/friends/requests/:id", authMiddleware, acceptFriendRequest);
router.delete("/api/user/friends/requests/:id", authMiddleware, rejectFriendRequest);

export default router;
