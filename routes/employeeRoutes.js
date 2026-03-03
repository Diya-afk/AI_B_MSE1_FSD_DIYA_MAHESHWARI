const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, controller.createEmployee);
router.get("/", controller.getEmployees);
router.get("/search", controller.searchEmployee);
router.get("/:id", controller.getEmployeeById);
router.put("/:id", controller.updateEmployee);
router.delete("/:id", controller.deleteEmployee);

module.exports = router;