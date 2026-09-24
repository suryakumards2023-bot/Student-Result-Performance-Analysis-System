import express from "express";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/student.js";

import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();

// Create student
router.post("/", protect, authorizeRoles("admin", "faculty"), createStudent);

// Get all students
router.get("/", protect, authorizeRoles("admin", "faculty", "student"), getStudents);

// Get single student
router.get("/:id", protect, authorizeRoles("admin", "faculty", "student"), getStudentById);

// Update student
router.put("/:id", protect, authorizeRoles("admin"), updateStudent);

// Delete student
router.delete("/:id", protect, authorizeRoles("admin"), deleteStudent);

export default router;
