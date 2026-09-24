import express from "express";

import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/department.js";

import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createDepartment);

router.get("/", protect, authorizeRoles("admin", "faculty"), getDepartments);

router.get("/:id", protect, authorizeRoles("admin", "faculty"), getDepartmentById);

router.put("/:id", protect, authorizeRoles("admin"), updateDepartment);

router.delete("/:id", protect, authorizeRoles("admin"), deleteDepartment);

export default router;
