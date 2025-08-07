import { Router } from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/tasksController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/api/tasks", authMiddleware, getTasks);
router.post("/api/tasks", authMiddleware, createTask);
router.get("/api/tasks/:id", getTask);
router.put("/api/tasks", authMiddleware, updateTask);
router.delete("/api/tasks/:id", deleteTask);

export default router;