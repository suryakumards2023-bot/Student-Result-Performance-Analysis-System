import express from "express";

import {
  createResult,
  getResults,
  getStudentResults,
  getResultById,
  updateResult,
  deleteResult,
  generateStudentResultPDF
} from "../controllers/result.js";

import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "faculty"), createResult);

router.get("/", protect, authorizeRoles("admin", "faculty", "student"), getResults);
router.get("/student/:studentId", protect, authorizeRoles("admin", "faculty", "student"), getStudentResults);

router.get(
  "/student/:studentId/pdf",
  protect, authorizeRoles("admin", "faculty"),
  generateStudentResultPDF
);

router.get("/:id", protect, authorizeRoles("admin", "faculty", "student"), getResultById);

router.put("/:id", protect, authorizeRoles("admin"), updateResult);

router.delete("/:id", protect, authorizeRoles("admin"), deleteResult);

export default router;
