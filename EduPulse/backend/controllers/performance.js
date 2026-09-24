import Result from "../models/Result.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Department from "../models/Department.js";
import { calculateGrade } from "../utils/gradeCalculator.js";

// =========================
// GET STUDENT PERFORMANCE
// GET /api/performance/student/:studentId
// =========================
export const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (req.user.role === "student") {
      const ownStudent = await Student.findOne({ user: req.user._id }).select("_id");
      if (!ownStudent || String(ownStudent._id) !== studentId) return res.status(403).json({ success: false, message: "You can only access your own performance" });
    }

    // Find student
    const student = await Student.findById(studentId).populate("department", "name code");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Find student's results
    const results = await Result.find({
      student: studentId
    })
      .populate(
        "subject",
        "subjectId name code credits"
      )
      .sort({
        semester: 1,
        createdAt: 1
      });

    // Total marks
    const totalMarks = results.reduce(
      (total, result) => total + result.marksObtained,
      0
    );

    // Maximum marks
    const totalMaxMarks = results.reduce(
      (total, result) => total + result.maxMarks,
      0
    );

    // Overall percentage
    const overallPercentage =
      totalMaxMarks > 0
        ? Number(
            ((totalMarks / totalMaxMarks) * 100).toFixed(2)
          )
        : 0;

    // Average percentage
    const averagePercentage = results.length ? Number((results.reduce((total, result) => total + result.percentage, 0) / results.length).toFixed(2)) : 0;

    // Pass/fail count
    const passedSubjects = results.filter(
      (result) => result.status === "Pass"
    ).length;

    const failedSubjects = results.filter(
      (result) => result.status === "Fail"
    ).length;

    // Highest and lowest
    const highestPercentage = results.length ? Math.max(...results.map((result) => result.percentage)) : 0;

    const lowestPercentage = results.length ? Math.min(...results.map((result) => result.percentage)) : 0;

    // Grade distribution
    const gradeDistribution = {};

    results.forEach((result) => {
      if (!gradeDistribution[result.grade]) {
        gradeDistribution[result.grade] = 0;
      }

      gradeDistribution[result.grade]++;
    });

    // Semester-wise performance
    const semesterMap = {};

    results.forEach((result) => {
      if (!semesterMap[result.semester]) {
        semesterMap[result.semester] = {
          semester: result.semester,
          totalMarks: 0,
          maxMarks: 0,
          subjects: 0,
          passedSubjects: 0
        };
      }

      semesterMap[result.semester].totalMarks +=
        result.marksObtained;

      semesterMap[result.semester].maxMarks +=
        result.maxMarks;

      semesterMap[result.semester].subjects++;
      if (result.status === "Pass") semesterMap[result.semester].passedSubjects++;
    });

    const semesterPerformance = Object.values(semesterMap).map((semester) => ({
      ...semester,
      percentage:
        semester.maxMarks > 0
          ? Number(
              (
                (semester.totalMarks /
                  semester.maxMarks) *
                100
              ).toFixed(2)
            )
          : 0
    })).sort((a, b) => Number(a.semester) - Number(b.semester));

    const bestSemester = semesterPerformance.reduce(
      (best, semester) => (!best || semester.percentage > best.percentage ? semester : best),
      null
    );

    const subjectPerformance = results.map((result) => ({
      id: result._id,
      subject: result.subject?.name || "Unknown subject",
      code: result.subject?.code || "-",
      semester: result.semester,
      marks: result.marksObtained,
      maxMarks: result.maxMarks,
      percentage: result.percentage,
      grade: result.grade,
      status: result.status,
      date: result.createdAt
    }));

    res.status(200).json({
      success: true,

      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department,
        course: student.course,
        currentSemester: student.semester
      },

      performance: {
        totalSubjects: results.length,
        totalMarks,
        totalMaxMarks,
        overallPercentage,
        overallGrade: results.length ? calculateGrade(overallPercentage) : "-",
        averagePercentage: results.length ? averagePercentage : 0,
        averageMarks: results.length ? Number((totalMarks / results.length).toFixed(2)) : 0,
        passedSubjects,
        failedSubjects,
        highestPercentage,
        lowestPercentage,
        passPercentage: results.length ? Number(((passedSubjects / results.length) * 100).toFixed(2)) : 0,
        gradeDistribution,
        semesterPerformance,
        subjectPerformance,
        bestSemester: bestSemester?.semester || null
      },

      results
    });
  } catch (error) {
    console.error(
      "Get student performance error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getDepartmentPerformance = async (req, res) => {
  try {
    const departments = await Department.find().select("name code");
    const performance = await Promise.all(departments.map(async (department) => {
      const students = await Student.find({ department: department._id }).select("_id");
      const results = await Result.find({ student: { $in: students.map((student) => student._id) } }).select("percentage status");
      const passed = results.filter((result) => result.status === "Pass").length;
      return { department: department.name, totalStudents: students.length, totalResults: results.length, averagePercentage: results.length ? Number((results.reduce((sum, result) => sum + result.percentage, 0) / results.length).toFixed(2)) : 0, passPercentage: results.length ? Number((passed / results.length * 100).toFixed(2)) : 0 };
    }));
    res.json({ success: true, data: { performance } });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to load department performance" }); }
};

export const getSubjectPerformance = async (req, res) => {
  try {
    const subjects = await Subject.find().select("name code department semester").populate("department", "name code");
    const performance = await Promise.all(subjects.map(async (subject) => {
      const results = await Result.find({ subject: subject._id }).select("percentage marksObtained status");
      const passed = results.filter((result) => result.status === "Pass").length;
      return { subject: subject.name, code: subject.code, department: subject.department, semester: subject.semester, totalResults: results.length, averageMarks: results.length ? Number((results.reduce((sum, result) => sum + result.marksObtained, 0) / results.length).toFixed(2)) : null, averagePercentage: results.length ? Number((results.reduce((sum, result) => sum + result.percentage, 0) / results.length).toFixed(2)) : null, passRate: results.length ? Number((passed / results.length * 100).toFixed(2)) : null };
    }));
    res.json({ success: true, data: { performance } });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to load subject performance" }); }
};
