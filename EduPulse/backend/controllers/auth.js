import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================
// REGISTER USER
// =========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const allowedRoles = ["student"];
    if (role && !allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const userRole = role ? role.toLowerCase() : "student";

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } }
    });
  } catch (error) {
    console.error("Register error:", error.message);

    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production" ? "Unable to register right now" : error.message
    });
  }
};

// =========================
// LOGIN USER
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const userRole = user.role.toLowerCase();

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: userRole
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: { user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole
      } }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// =========================
// GET CURRENT USER
// =========================
export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    console.error("Get current user error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
