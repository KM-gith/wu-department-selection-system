const express = require("express");
const { run, publish, unpublish, summary } = require("../controllers/placementController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.post("/run", requireAuth, requireRole("registrar"), run);
router.post("/publish", requireAuth, requireRole("registrar"), publish);
router.post("/unpublish", requireAuth, requireRole("registrar"), unpublish);
router.get("/summary", requireAuth, requireRole("registrar"), summary);

module.exports = router;
