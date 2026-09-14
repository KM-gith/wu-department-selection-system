const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, identifier: user.identifier, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register-student
async function registerStudent(req, res) {
  try {
    const { studentIdNumber, name, password, cgpa, gender, disability } = req.body;
    if (!studentIdNumber || !name || !password || cgpa == null || !gender) {
      return res.status(400).json({ error: "studentIdNumber, name, password, cgpa, and gender are required." });
    }
    const identifier = studentIdNumber.trim().toLowerCase();
    const existing = await User.findOne({ identifier });
    if (existing) return res.status(409).json({ error: "An account with this student ID already exists." });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ identifier, name, role: "student", passwordHash });
    const profile = await StudentProfile.create({
      user: user._id,
      studentIdNumber: studentIdNumber.trim(),
      cgpa,
      gender,
      disability: !!disability,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role }, profile });
  } catch (err) {
    res.status(500).json({ error: "Registration failed.", detail: err.message });
  }
}

// POST /api/auth/register-registrar
async function registerRegistrar(req, res) {
  try {
    const { email, name, password, adminKey } = req.body;
    if (!email || !name || !password || !adminKey) {
      return res.status(400).json({ error: "email, name, password, and adminKey are required." });
    }
    if (adminKey !== process.env.ADMIN_SIGNUP_KEY) {
      return res.status(403).json({ error: "Invalid admin key." });
    }
    const identifier = email.trim().toLowerCase();
    const existing = await User.findOne({ identifier });
    if (existing) return res.status(409).json({ error: "An account with this email already exists." });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ identifier, name, role: "registrar", passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed.", detail: err.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "identifier and password are required." });
    }
    const user = await User.findOne({ identifier: identifier.trim().toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials." });

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed.", detail: err.message });
  }
}

// GET /api/auth/me
async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { registerStudent, registerRegistrar, login, me };
