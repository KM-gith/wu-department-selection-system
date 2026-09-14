const StudentProfile = require("../models/StudentProfile");
const Department = require("../models/Department");
const Settings = require("../models/Settings");
const { runPlacement } = require("../utils/placementAlgorithm");

// POST /api/placement/run  (registrar) - computes and saves assignedDept for all students,
// but results stay hidden from students until /publish is called.
async function run(req, res) {
  const departments = await Department.find();
  const capacityByCode = {};
  departments.forEach((d) => (capacityByCode[d.code] = d.capacity));

  const students = await StudentProfile.find();
  const assignments = runPlacement(students, capacityByCode, (await Settings.getSettings()).weight);

  const bulkOps = students.map((s) => ({
    updateOne: {
      filter: { _id: s._id },
      update: { assignedDept: assignments[String(s._id)] || null },
    },
  }));
  if (bulkOps.length) await StudentProfile.bulkWrite(bulkOps);

  const settings = await Settings.getSettings();
  settings.lastRunAt = new Date();
  await settings.save();

  const updated = await StudentProfile.find().populate("user", "name identifier");
  res.json({ students: updated, published: settings.published });
}

// POST /api/placement/publish (registrar)
async function publish(req, res) {
  const settings = await Settings.getSettings();
  settings.published = true;
  await settings.save();
  res.json({ settings });
}

// POST /api/placement/unpublish (registrar)
async function unpublish(req, res) {
  const settings = await Settings.getSettings();
  settings.published = false;
  await settings.save();
  res.json({ settings });
}

// GET /api/placement/summary (registrar)
async function summary(req, res) {
  const departments = await Department.find();
  const students = await StudentProfile.find();
  const data = departments.map((d) => ({
    code: d.code,
    name: d.name,
    capacity: d.capacity,
    filled: students.filter((s) => s.assignedDept === d.code).length,
    female: students.filter((s) => s.assignedDept === d.code && s.gender === "F").length,
    male: students.filter((s) => s.assignedDept === d.code && s.gender === "M").length,
    highestCgpa: Math.max(0, ...students.filter((s) => s.assignedDept === d.code).map((s) => s.cgpa)) || null,
    lowestCgpa: (() => {
      const cgpas = students.filter((s) => s.assignedDept === d.code).map((s) => s.cgpa);
      return cgpas.length ? Math.min(...cgpas) : null;
    })(),
  }));
  res.json({ summary: data });
}

module.exports = { run, publish, unpublish, summary };
