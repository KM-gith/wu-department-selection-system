const Settings = require("../models/Settings");

// GET /api/settings
async function getSettings(req, res) {
  const settings = await Settings.getSettings();
  res.json({ settings });
}

// PUT /api/settings   { weight }
async function updateSettings(req, res) {
  const { weight } = req.body;
  const settings = await Settings.getSettings();
  if (weight !== undefined) {
    const num = Number(weight);
    if (Number.isNaN(num) || num < 0) return res.status(400).json({ error: "weight must be a non-negative number." });
    settings.weight = num;
  }
  await settings.save();
  res.json({ settings });
}

module.exports = { getSettings, updateSettings };
