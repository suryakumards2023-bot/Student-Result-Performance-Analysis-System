import express from "express";

import {
  getDashboardStats,
  getDepartmentPerformance,
  getSemesterPerformance,
  getTopStudents,
  getPassFailDistribution,
  getRecentResults
} from "../controllers/dashboard.js";

import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();

// Dashboard statistics
router.get(
  "/stats",
  protect, authorizeRoles("admin", "faculty"),
  getDashboardStats
);

// Department-wise performance
router.get(
  "/department-performance",
  protect, authorizeRoles("admin", "faculty"),
  getDepartmentPerformance
);

// Semester-wise performance
router.get(
  "/semester-performance",
  protect, authorizeRoles("admin", "faculty"),
  getSemesterPerformance
);

// Top performing students
router.get(
  "/top-students",
  protect, authorizeRoles("admin", "faculty"),
  getTopStudents
);

// Pass / Fail distribution
router.get(
  "/pass-fail",
  protect, authorizeRoles("admin", "faculty"),
  getPassFailDistribution
);

router.get(
  "/recent-results",
  protect, authorizeRoles("admin", "faculty"),
  getRecentResults
);

export default router;
