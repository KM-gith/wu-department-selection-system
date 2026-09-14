const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  singleton: { type: String, default: "singleton", unique: true },
  published: { type: Boolean, default: false },
  weight: { type: Number, default: 0.15 },
  lastRunAt: { type: Date, default: null },
});

async function getSettings() {
  let settings = await mongoose.model("Settings").findOne({ singleton: "singleton" });
  if (!settings) {
    settings = await mongoose.model("Settings").create({ singleton: "singleton" });
  }
  return settings;
}

settingsSchema.statics.getSettings = getSettings;

module.exports = mongoose.model("Settings", settingsSchema);
