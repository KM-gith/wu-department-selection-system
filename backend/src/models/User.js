const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Students log in with their student ID, registrars/deans with an email.
    identifier: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["student", "registrar"], required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
