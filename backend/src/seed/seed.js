require("dotenv").config();
const connectDB = require("../config/db");
const Department = require("../models/Department");
const Settings = require("../models/Settings");

const DEPARTMENTS = [
  { code: "CS", name: "Computer Science", blurb: "Algorithms, software engineering, and the theory of computing.", capacity: 45 },
  { code: "IT", name: "Information Technology", blurb: "Networks, systems administration, and IT infrastructure.", capacity: 35 },
  { code: "IS", name: "Information System", blurb: "Where business processes meet information systems.", capacity: 30 },
  { code: "CE", name: "Civil Engineering", blurb: "Design and construction of roads, buildings, and infrastructure.", capacity: 60 },
  { code: "ECE", name: "Electrical and Computer Engineering", blurb: "Power systems, electronics, and embedded computing.", capacity: 55 },
  { code: "ME", name: "Mechanical Engineering", blurb: "Machine design, thermodynamics, and manufacturing systems.", capacity: 55 },
  { code: "CHE", name: "Chemical Engineering", blurb: "Chemical processes, materials transformation, and plant design.", capacity: 40 },
  { code: "WREE", name: "Water Resources & Environmental Engineering", blurb: "Water supply, irrigation, and environmental protection systems.", capacity: 35 },
  { code: "ARCH", name: "Architecture", blurb: "Building design, urban planning, and the built environment.", capacity: 25 },
  { code: "MME", name: "Mining & Materials Engineering", blurb: "Mineral extraction, processing, and materials science.", capacity: 25 },
];

async function seed() {
  await connectDB();
  for (const dept of DEPARTMENTS) {
    // $setOnInsert keeps this non-destructive: departments that already exist
    // (e.g. because a registrar already changed their capacity) are left alone.
    // Only brand-new department codes get created with these defaults.
    await Department.findOneAndUpdate(
      { code: dept.code },
      { $setOnInsert: dept },
      { upsert: true, new: true }
    );
  }
  await Settings.getSettings();
  console.log("Seeded/ensured departments:", DEPARTMENTS.map((d) => d.code).join(", "));
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
