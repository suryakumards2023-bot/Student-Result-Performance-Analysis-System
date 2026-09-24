import Student from "../models/Student.js";
import Department from "../models/Department.js";
import Result from "../models/Result.js";

// =========================
// CREATE STUDENT
// POST /api/students
// =========================
export const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      user,
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      department,
      course,
      semester,
      admissionYear,
      address,
      status
    } = req.body;

    // Required fields
    if (
      !studentId ||
      !name ||
      !email ||
      !department ||
      !course ||
      !semester ||
      !admissionYear
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, name, email, department, course, semester and admissionYear are required"
      });
    }

    if (!(await Department.exists({ _id: department }))) return res.status(400).json({ success: false, message: "Department not found" });
    // Check duplicate student ID
    const existingStudentId = await Student.findOne({ studentId });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already exists"
      });
    }

    // Check duplicate email
    const existingEmail = await Student.findOne({
      email: email.toLowerCase()
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email already exists"
      });
    }

    // Create student
    const student = await Student.create({
      studentId, user: user || undefined,
      name,
      email: email.toLowerCase(),
      phone,
      gender,
      dateOfBirth,
      department,
      course,
      semester,
      admissionYear,
      address,
      status
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: { student: await student.populate("department", "name code") }
    });
  } catch (error) {
    console.error("Create student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET ALL STUDENTS
// GET /api/students
// =========================
export const getStudents = async (req, res) => {
  try {
    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id }).populate("department", "name code");
      return res.json({ success: true, data: { students: student ? [student] : [], pagination: { total: student ? 1 : 0, page: 1, limit: 1, pages: 1 } } });
    }
    const { search = "", department, semester, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { studentId: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);
    const [students, total] = await Promise.all([Student.find(filter).populate("department", "name code").sort({
      createdAt: -1
    }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)), Student.countDocuments(filter)]);

    res.status(200).json({
      success: true,
      data: { students, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } }
    });
  } catch (error) {
    console.error("Get students error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET STUDENT BY ID
// GET /api/students/:id
// =========================
export const getStudentById = async (req, res) => {
  try {
    if (req.user.role === "student") {
      const own = await Student.findOne({ _id: req.params.id, user: req.user._id }).populate("department", "name code");
      if (!own) return res.status(403).json({ success: false, message: "You can only access your own academic information" });
      return res.json({ success: true, data: { student: own } });
    }
    const student = await Student.findById(req.params.id).populate("department", "name code");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { student }
    });
  } catch (error) {
    console.error("Get student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Invalid student ID"
    });
  }
};


// =========================
// UPDATE STUDENT
// PUT /api/students/:id
// =========================
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Update allowed fields
    const fields = [
      "studentId",
      "name",
      "email",
      "phone",
      "gender",
      "dateOfBirth",
      "department",
      "course",
      "semester",
      "admissionYear",
      "address",
      "status"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] =
          field === "email"
            ? req.body[field].toLowerCase()
            : req.body[field];
      }
    });

    if (req.body.department && !(await Department.exists({ _id: req.body.department }))) return res.status(400).json({ success: false, message: "Department not found" });
    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: { student: await updatedStudent.populate("department", "name code") }
    });
  } catch (error) {
    console.error("Update student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// DELETE STUDENT
// DELETE /api/students/:id
// =========================
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    await Promise.all([Student.findByIdAndDelete(req.params.id), Result.deleteMany({ student: req.params.id })]);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error("Delete student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
