import { Router } from "express";
import { addComment, getCommentReplies, getComments, replyToComment } from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/api/comments/:taskId", getComments);
router.post("/api/comments", authMiddleware, addComment);
router.get("/api/comments/:id/replies", getCommentReplies);
router.post("/api/comments/:id/reply", authMiddleware, replyToComment);

export default router;