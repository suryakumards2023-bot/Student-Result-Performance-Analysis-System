import express from "express";

import {
  getStudentPerformance, getDepartmentPerformance, getSubjectPerformance
} from "../controllers/performance.js";

import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();

router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin", "faculty", "student"),
  getStudentPerformance
);
router.get("/departments", protect, authorizeRoles("admin", "faculty"), getDepartmentPerformance);
router.get("/subjects", protect, authorizeRoles("admin", "faculty"), getSubjectPerformance);

export default router;
