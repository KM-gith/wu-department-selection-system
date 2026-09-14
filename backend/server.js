require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const placementRoutes = require("./src/routes/placementRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/settings", settingsRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`WU-DSS API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
