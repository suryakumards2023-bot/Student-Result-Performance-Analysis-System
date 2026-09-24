import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import departmentRoutes from "./routes/department.js";
import subjectRoutes from "./routes/subject.js";
import resultRoutes from "./routes/result.js";
import performanceRoutes from "./routes/performance.js";
import uploadRoutes from "./routes/upload.js";
import dashboardRoutes from "./routes/dashboard.js";
import facultyRoutes from "./routes/faculty.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/faculty", facultyRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduTrack Backend API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});
