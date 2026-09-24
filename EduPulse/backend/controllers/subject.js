import Subject from "../models/Subject.js";
import Department from "../models/Department.js";

// =========================
// CREATE SUBJECT
// POST /api/subjects
// =========================
export const createSubject = async (req, res) => {
  try {
    const {
      subjectId,
      name,
      code,
      department,
      course,
      semester,
      credits,
      maxMarks,
      passingMarks,
      status
    } = req.body;

    if (
      !subjectId ||
      !name ||
      !code ||
      !department ||
      !course ||
      !semester ||
      !credits
    ) {
      return res.status(400).json({
        success: false,
        message:
          "subjectId, name, code, department, course, semester and credits are required"
      });
    }

    if (!(await Department.exists({ _id: department }))) return res.status(400).json({ success: false, message: "Department not found" });
    const existingSubject = await Subject.findOne({
      $or: [
        { subjectId },
        { code: code.toUpperCase() }
      ]
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: "Subject ID or code already exists"
      });
    }

    const subject = await Subject.create({
      subjectId,
      name,
      code,
      department,
      course,
      semester,
      credits,
      maxMarks,
      passingMarks,
      status
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: { subject: await subject.populate("department", "name code") }
    });
  } catch (error) {
    console.error("Create subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET ALL SUBJECTS
// GET /api/subjects
// =========================
export const getSubjects = async (req, res) => {
  try {
    const { department, semester, search = "" } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { code: { $regex: search, $options: "i" } }];
    const subjects = await Subject.find(filter).populate("department", "name code").sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: { subjects }
    });
  } catch (error) {
    console.error("Get subjects error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET SUBJECT BY ID
// GET /api/subjects/:id
// =========================
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("department", "name code");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { subject }
    });
  } catch (error) {
    console.error("Get subject error:", error.message);

    res.status(400).json({
      success: false,
      message: "Invalid subject ID"
    });
  }
};


// =========================
// UPDATE SUBJECT
// PUT /api/subjects/:id
// =========================
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const fields = [
      "subjectId",
      "name",
      "code",
      "department",
      "course",
      "semester",
      "credits",
      "maxMarks",
      "passingMarks",
      "status"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        subject[field] =
          field === "code"
            ? req.body[field].toUpperCase()
            : req.body[field];
      }
    });

    if (req.body.department && !(await Department.exists({ _id: req.body.department }))) return res.status(400).json({ success: false, message: "Department not found" });
    const updatedSubject = await subject.save();

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: { subject: await updatedSubject.populate("department", "name code") }
    });
  } catch (error) {
    console.error("Update subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// DELETE SUBJECT
// DELETE /api/subjects/:id
// =========================
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully"
    });
  } catch (error) {
    console.error("Delete subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
