const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    studentIdNumber: { type: String, required: true, unique: true, trim: true },
    cgpa: { type: Number, required: true, min: 0, max: 4 },
    gender: { type: String, enum: ["M", "F"], required: true },
    disability: { type: Boolean, default: false },
    // Ordered list of department codes, highest preference first. A full ranking
    // (one entry per department, no duplicates) is required before it counts as submitted.
    preferences: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => new Set(arr).size === arr.length,
        message: "Preferences cannot contain duplicate departments.",
      },
    },
    submittedAt: { type: Date, default: null },
    assignedDept: { type: String, default: null },
    complaint: {
      text: { type: String, default: null },
      resolved: { type: Boolean, default: false },
      createdAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
