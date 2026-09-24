import express from "express";
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from "../controllers/faculty.js";
import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();
const adminOnly = [protect, authorizeRoles("admin")];

router.get("/", ...adminOnly, getFaculty);
router.post("/", ...adminOnly, createFaculty);
router.put("/:id", ...adminOnly, updateFaculty);
router.delete("/:id", ...adminOnly, deleteFaculty);

export default router;
