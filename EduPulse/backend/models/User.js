import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student"
    },

    facultyId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    phone: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    }],
    joiningDate: Date,
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

const User = mongoose.model("User", userSchema);

export default User;