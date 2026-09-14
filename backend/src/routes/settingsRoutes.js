const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.get("/", requireAuth, getSettings);
router.put("/", requireAuth, requireRole("registrar"), updateSettings);

module.exports = router;
