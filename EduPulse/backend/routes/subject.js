import express from "express";

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controllers/subject.js";

import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createSubject);

router.get("/", protect, authorizeRoles("admin", "faculty", "student"), getSubjects);

router.get("/:id", protect, authorizeRoles("admin", "faculty", "student"), getSubjectById);

router.put("/:id", protect, authorizeRoles("admin"), updateSubject);

router.delete("/:id", protect, authorizeRoles("admin"), deleteSubject);

export default router;
