const express = require("express");
const { listDepartments, updateDepartment } = require("../controllers/departmentController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.get("/", requireAuth, listDepartments);
router.put("/:code", requireAuth, requireRole("registrar"), updateDepartment);

module.exports = router;
