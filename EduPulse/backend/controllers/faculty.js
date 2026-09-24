import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Department from "../models/Department.js";

const facultyFields = "-password";

export const getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: "faculty" })
      .select(facultyFields)
      .populate("department", "name code")
      .populate("subjects", "name code");
    res.json({ success: true, data: { faculty } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load faculty" });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const { facultyId, name, email, password, phone, department, subjects, joiningDate, status } = req.body;
    if (!facultyId || !name || !email || !password) return res.status(400).json({ success: false, message: "Faculty ID, name, email and password are required" });
    if (await User.exists({ facultyId })) return res.status(400).json({ success: false, message: "Faculty ID already exists" });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(400).json({ success: false, message: "User already exists" });
    if (department && !(await Department.exists({ _id: department }))) return res.status(400).json({ success: false, message: "Department not found" });
    const faculty = await User.create({ facultyId, name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10), role: "faculty", phone, department, subjects, joiningDate, status });
    res.status(201).json({ success: true, data: { faculty: await faculty.populate("department", "name code") } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create faculty" });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const faculty = await User.findOne({ _id: req.params.id, role: "faculty" });
    if (!faculty) return res.status(404).json({ success: false, message: "Faculty not found" });
    const fields = ["facultyId", "name", "email", "phone", "department", "subjects", "joiningDate", "status"];
    fields.forEach((field) => { if (req.body[field] !== undefined) faculty[field] = field === "email" ? req.body[field].toLowerCase() : req.body[field]; });
    if (req.body.password) faculty.password = await bcrypt.hash(req.body.password, 10);
    await faculty.save();
    res.json({ success: true, data: { faculty: await faculty.populate("department", "name code") } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update faculty" });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: "faculty" });
    if (!deleted) return res.status(404).json({ success: false, message: "Faculty not found" });
    res.json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete faculty" });
  }
};
