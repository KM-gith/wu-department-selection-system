const StudentProfile = require("../models/StudentProfile");
const Department = require("../models/Department");
const User = require("../models/User");
const Settings = require("../models/Settings");
const bcrypt = require("bcryptjs");

// GET /api/students/me
async function getMyProfile(req, res) {
  const profile = await StudentProfile.findOne({ user: req.user.id });
  if (!profile) return res.status(404).json({ error: "Profile not found." });
  const settings = await Settings.getSettings();
  // Don't reveal the allocation to the student until the registrar publishes it.
  const visible = profile.toObject();
  if (!settings.published) visible.assignedDept = null;
  res.json({ profile: visible, published: settings.published });
}

// PUT /api/students/me   { cgpa?, gender?, disability?, preferences? }
async function updateMyProfile(req, res) {
  const profile = await StudentProfile.findOne({ user: req.user.id });
  if (!profile) return res.status(404).json({ error: "Profile not found." });

  const { cgpa, gender, disability, preferences } = req.body;

  if (preferences !== undefined) {
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ error: "preferences must be an array of department codes." });
    }
    const unique = new Set(preferences);
    if (unique.size !== preferences.length) {
      return res.status(400).json({ error: "preferences cannot contain duplicate departments." });
    }
    const allDepartments = await Department.find().distinct("code");
    const validCodes = new Set(allDepartments);
    for (const code of preferences) {
      if (!validCodes.has(code)) return res.status(400).json({ error: `Unknown department code: ${code}` });
    }
    profile.preferences = preferences;
    // Counts as "submitted" only once every department has been ranked.
    profile.submittedAt = preferences.length === allDepartments.length ? new Date() : profile.submittedAt;
  }
  if (cgpa !== undefined) profile.cgpa = cgpa;
  if (gender !== undefined) profile.gender = gender;
  if (disability !== undefined) profile.disability = !!disability;

  await profile.save();
  res.json({ profile });
}

// POST /api/students/me/complaint   { text }
async function fileComplaint(req, res) {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "text is required." });
  const profile = await StudentProfile.findOne({ user: req.user.id });
  if (!profile) return res.status(404).json({ error: "Profile not found." });
  profile.complaint = { text: text.trim(), resolved: false, createdAt: new Date() };
  await profile.save();
  res.json({ profile });
}

// GET /api/students  (registrar)
async function listStudents(req, res) {
  const profiles = await StudentProfile.find().populate("user", "name identifier").sort({ cgpa: -1 });
  res.json({ students: profiles });
}

// DELETE /api/students/:id  (registrar)
async function deleteStudent(req, res) {
  const profile = await StudentProfile.findById(req.params.id);
  if (!profile) return res.status(404).json({ error: "Not found." });
  await User.findByIdAndDelete(profile.user);
  await profile.deleteOne();
  res.json({ ok: true });
}

// GET /api/students/complaints (registrar)
async function listComplaints(req, res) {
  const profiles = await StudentProfile.find({ "complaint.text": { $ne: null } })
    .populate("user", "name identifier")
    .sort({ "complaint.createdAt": -1 });
  res.json({ students: profiles });
}

// PUT /api/students/:id/resolve-complaint (registrar)
async function resolveComplaint(req, res) {
  const profile = await StudentProfile.findById(req.params.id);
  if (!profile) return res.status(404).json({ error: "Not found." });
  profile.complaint.resolved = true;
  await profile.save();
  res.json({ profile });
}

// POST /api/students/sample-batch  (registrar) - dev/demo utility
const SAMPLE_NAMES = [
  "Biftu Tolera", "Girma Dabesa", "Lensa Bekele", "Kenea Fikadu", "Warqee Gemechu",
  "Diriba Wakjira", "Sadia Kemal", "Tolosa Bacha", "Ayantu Chala", "Nagasa Bulti",
  "Chaltu Debela", "Gemechu Alemu", "Boru Guyo", "Fayo Regassa", "Meseret Alemu",
];

async function addSampleBatch(req, res) {
  const codes = await Department.find().distinct("code");
  if (codes.length === 0) return res.status(400).json({ error: "Create departments before adding sample students." });

  const count = await StudentProfile.countDocuments();
  const created = [];
  for (let i = 0; i < 15; i++) {
    const idNum = `WU/PE/${1000 + count + i}/16`;
    const name = SAMPLE_NAMES[(count + i) % SAMPLE_NAMES.length];
    const gender = Math.random() > 0.5 ? "F" : "M";
    const disability = Math.random() < 0.08;
    const cgpa = +(2.1 + Math.random() * 1.85).toFixed(2);
    const shuffled = [...codes].sort(() => Math.random() - 0.5);

    const identifier = idNum.toLowerCase();
    const passwordHash = await bcrypt.hash("changeme123", 10);
    const user = await User.create({ identifier, name, role: "student", passwordHash });
    const profile = await StudentProfile.create({
      user: user._id,
      studentIdNumber: idNum,
      cgpa,
      gender,
      disability,
      preferences: shuffled,
      submittedAt: new Date(),
    });
    created.push(profile);
  }
  res.status(201).json({ created: created.length });
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  fileComplaint,
  listStudents,
  deleteStudent,
  listComplaints,
  resolveComplaint,
  addSampleBatch,
};
