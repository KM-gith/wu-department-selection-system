const express = require("express");
const {
  getMyProfile, updateMyProfile, fileComplaint,
  listStudents, deleteStudent, listComplaints, resolveComplaint, addSampleBatch,
} = require("../controllers/studentController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.get("/me", requireAuth, requireRole("student"), getMyProfile);
router.put("/me", requireAuth, requireRole("student"), updateMyProfile);
router.post("/me/complaint", requireAuth, requireRole("student"), fileComplaint);

router.get("/", requireAuth, requireRole("registrar"), listStudents);
router.get("/complaints", requireAuth, requireRole("registrar"), listComplaints);
router.put("/:id/resolve-complaint", requireAuth, requireRole("registrar"), resolveComplaint);
router.delete("/:id", requireAuth, requireRole("registrar"), deleteStudent);
router.post("/sample-batch", requireAuth, requireRole("registrar"), addSampleBatch);

module.exports = router;
