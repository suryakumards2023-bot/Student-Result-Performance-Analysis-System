import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other"
    },

    dateOfBirth: {
      type: Date
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      trim: true
    },

    course: {
      type: String,
      required: true,
      trim: true
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },

    admissionYear: {
      type: Number,
      required: true
    },

    address: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
