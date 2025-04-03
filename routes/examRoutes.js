import express from "express";
import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
} from "../controllers/examController.js";
import { isAuthenticated} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createExam);
router.get("/", getAllExams);
router.get("/:id", getExamById);
router.put("/:id", isAuthenticated, updateExam);

export default router;
