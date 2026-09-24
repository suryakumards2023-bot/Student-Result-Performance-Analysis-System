import express from "express";
import multer from "multer";
import fs from "fs";

import {
  uploadResults
} from "../controllers/upload.js";

import protect from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";

const router = express.Router();

// Upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = "uploads/";
    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => /\.(csv|xlsx|xls)$/i.test(file.originalname) ? cb(null, true) : cb(new Error("Only CSV and Excel files are supported"))
});

// Upload result Excel
router.post(
  "/results",
  protect,
  authorizeRoles("admin"),
  upload.single("file"),
  uploadResults
);

export default router;
