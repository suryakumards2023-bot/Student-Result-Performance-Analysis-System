import Department from "../models/Department.js";

// CREATE DEPARTMENT
export const createDepartment = async (req, res) => {
  try {
    const {
      departmentId,
      name,
      code,
      description,
      hod,
      status
    } = req.body;

    if (!departmentId || !name || !code) {
      return res.status(400).json({
        success: false,
        message: "departmentId, name and code are required"
      });
    }

    const existingDepartment = await Department.findOne({
      $or: [
        { departmentId },
        { name },
        { code: code.toUpperCase() }
      ]
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department ID, name or code already exists"
      });
    }

    const department = await Department.create({
      departmentId,
      name,
      code,
      description,
      hod,
      status
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: { department }
    });
  } catch (error) {
    console.error("Create department error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// GET ALL DEPARTMENTS
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: { departments }
    });
  } catch (error) {
    console.error("Get departments error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// GET DEPARTMENT BY ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { department }
    });
  } catch (error) {
    console.error("Get department error:", error.message);

    res.status(400).json({
      success: false,
      message: "Invalid department ID"
    });
  }
};


// UPDATE DEPARTMENT
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(
      req.params.id
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    const fields = [
      "departmentId",
      "name",
      "code",
      "description",
      "hod",
      "status"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        department[field] = req.body[field];
      }
    });

    const updatedDepartment = await department.save();

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: { department: updatedDepartment }
    });
  } catch (error) {
    console.error("Update department error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// DELETE DEPARTMENT
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(
      req.params.id
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully"
    });
  } catch (error) {
    console.error("Delete department error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
