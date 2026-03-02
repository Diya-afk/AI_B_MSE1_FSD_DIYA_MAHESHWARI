const Employee = require("../models/employee");

// CREATE
exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// GET ALL
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();  // find() used here
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// GET BY ID
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// SEARCH (using find())
exports.searchEmployee = async (req, res, next) => {
  try {
    const { name, department } = req.query;

    const query = {};

    if (name) {
      query.fullName = { $regex: name, $options: "i" };
    }

    if (department) {
      query.department = department;
    }

    const employees = await Employee.find(query); // find() used

    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};
// 👉 MongoDB me findAll() hota hi nahi.
// We use find() for reading all records.