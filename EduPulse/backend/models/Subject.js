import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectId: {
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

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
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

    credits: {
      type: Number,
      required: true,
      min: 1
    },

    maxMarks: {
      type: Number,
      default: 100
    },

    passingMarks: {
      type: Number,
      default: 40
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
