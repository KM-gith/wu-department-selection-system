const Department = require("../models/Department");

// GET /api/departments
async function listDepartments(req, res) {
  const depts = await Department.find().sort({ code: 1 });
  res.json({ departments: depts });
}

// PUT /api/departments/:code   { name?, blurb?, capacity? }
async function updateDepartment(req, res) {
  const { code } = req.params;
  const { name, blurb, capacity } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (blurb !== undefined) update.blurb = blurb;
  if (capacity !== undefined) {
    const num = Number(capacity);
    if (Number.isNaN(num) || num < 0) return res.status(400).json({ error: "capacity must be a non-negative number." });
    update.capacity = num;
  }
  const dept = await Department.findOneAndUpdate({ code: code.toUpperCase() }, update, { new: true });
  if (!dept) return res.status(404).json({ error: "Department not found." });
  res.json({ department: dept });
}

module.exports = { listDepartments, updateDepartment };
