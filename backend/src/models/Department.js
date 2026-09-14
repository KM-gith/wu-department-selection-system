const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    blurb: { type: String, default: "" },
    capacity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
