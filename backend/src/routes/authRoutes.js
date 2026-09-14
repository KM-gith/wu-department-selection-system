const express = require("express");
const { registerStudent, registerRegistrar, login, me } = require("../controllers/authController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.post("/register-student", registerStudent);
router.post("/register-registrar", registerRegistrar);
router.post("/login", login);
router.get("/me", requireAuth, me);

module.exports = router;
