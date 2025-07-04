import express from "express";
import {adminOnly, protect} from "../middlewares/authMiddleware.js";
import {
  createTask, deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getUserDashboardData, updateTask,
  updateTaskChecklist, updateTaskStatus
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

export default router;
