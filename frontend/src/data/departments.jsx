import { Code2, Network, Database, HardHat, Cpu, Cog, FlaskConical, Waves, Building2, Mountain } from "lucide-react";

export const DEPARTMENTS = [
  {
    code: "CS",
    name: "Computer Science",
    blurb: "Algorithms, software engineering, and the theory of computing.",
    description:
      "Computer Science covers the theory and practice of computing: algorithms and data structures, software engineering, databases, operating systems, and artificial intelligence. Students build the problem-solving foundation to design and build software systems from the ground up.",
    highlights: [
      "Programming, algorithms, and data structures",
      "Software engineering and databases",
      "Operating systems and computer networks",
      "Artificial intelligence and machine learning foundations",
    ],
    icon: Code2,
    bg: "#E7ECF3",
    fg: "#1F3A5F",
  },
  {
    code: "IT",
    name: "Information Technology",
    blurb: "Networks, systems administration, and IT infrastructure.",
    description:
      "Information Technology focuses on deploying, configuring, and maintaining the systems organizations run on: networks, servers, cloud infrastructure, and IT security. Graduates keep technology running reliably and securely for institutions and businesses.",
    highlights: [
      "Computer networks and network administration",
      "Systems and server administration",
      "IT security and infrastructure management",
      "Cloud computing and virtualization",
    ],
    icon: Network,
    bg: "#DCE9E1",
    fg: "#3B6E58",
  },
  {
    code: "IS",
    name: "Information System",
    blurb: "Where business processes meet information systems.",
    description:
      "Information Systems sits at the intersection of business and technology, focused on how organizations use information systems to manage operations and support decisions. Students learn systems analysis, databases, and how technology strategy aligns with business goals.",
    highlights: [
      "Systems analysis and design",
      "Database management for organizations",
      "Business process modeling",
      "IT project management",
    ],
    icon: Database,
    bg: "#F5E9D1",
    fg: "#B8862F",
  },
  {
    code: "CE",
    name: "Civil Engineering",
    blurb: "Design and construction of roads, buildings, and infrastructure.",
    description:
      "Civil Engineering trains students to plan, design, and supervise the construction of roads, bridges, buildings, and public infrastructure. The program combines structural analysis, materials science, and construction management.",
    highlights: [
      "Structural analysis and design",
      "Construction materials and methods",
      "Transportation and highway engineering",
      "Surveying and geotechnical engineering",
    ],
    icon: HardHat,
    bg: "#F0DEDA",
    fg: "#9C4A3C",
  },
  {
    code: "ECE",
    name: "Electrical and Computer Engineering",
    blurb: "Power systems, electronics, and embedded computing.",
    description:
      "Electrical and Computer Engineering covers power systems, electronics, telecommunications, and embedded computing. Students design circuits and systems that generate, distribute, and make use of electrical power and digital computation.",
    highlights: [
      "Circuit design and electronics",
      "Power systems and generation",
      "Telecommunications and signal processing",
      "Embedded and digital systems",
    ],
    icon: Cpu,
    bg: "#E3DCF0",
    fg: "#5B3F8C",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
    blurb: "Machine design, thermodynamics, and manufacturing systems.",
    description:
      "Mechanical Engineering covers the design, analysis, and manufacturing of mechanical systems and machines. Coursework spans thermodynamics, fluid mechanics, materials, and manufacturing processes.",
    highlights: [
      "Machine design and mechanics",
      "Thermodynamics and fluid mechanics",
      "Manufacturing and production systems",
      "Materials science and engineering",
    ],
    icon: Cog,
    bg: "#DCEAF0",
    fg: "#2C6E7C",
  },
  {
    code: "CHE",
    name: "Chemical Engineering",
    blurb: "Chemical processes, materials transformation, and plant design.",
    description:
      "Chemical Engineering focuses on the processes that transform raw materials into useful products, from chemical reactions to plant-scale design. Students study process design, thermodynamics, and industrial-scale chemical operations.",
    highlights: [
      "Chemical process design",
      "Thermodynamics and reaction engineering",
      "Plant design and process safety",
      "Materials and industrial chemistry",
    ],
    icon: FlaskConical,
    bg: "#F0E8DC",
    fg: "#8C6B3F",
  },
  {
    code: "WREE",
    name: "Water Resources & Environmental Engineering",
    blurb: "Water supply, irrigation, and environmental protection systems.",
    description:
      "Water Resources & Environmental Engineering trains students to design water supply, irrigation, and drainage systems, and to manage environmental protection challenges. The program blends hydrology, hydraulics, and environmental science.",
    highlights: [
      "Hydrology and hydraulics",
      "Water supply and irrigation systems",
      "Environmental protection and sanitation",
      "Watershed and resource management",
    ],
    icon: Waves,
    bg: "#DCE7F0",
    fg: "#2C5F8C",
  },
  {
    code: "ARCH",
    name: "Architecture",
    blurb: "Building design, urban planning, and the built environment.",
    description:
      "Architecture trains students to design buildings and shape the built environment, balancing aesthetics, function, and structural feasibility. The program covers design studio work, urban planning principles, and building technology.",
    highlights: [
      "Architectural design studio",
      "Urban planning and design",
      "Building technology and materials",
      "History and theory of architecture",
    ],
    icon: Building2,
    bg: "#F0DCEA",
    fg: "#8C3F6B",
  },
  {
    code: "MME",
    name: "Mining & Materials Engineering",
    blurb: "Mineral extraction, processing, and materials science.",
    description:
      "Mining & Materials Engineering covers the extraction and processing of mineral resources along with the science of engineering materials. Students study mine planning, mineral processing, and the properties of metals, ceramics, and composites.",
    highlights: [
      "Mine planning and extraction methods",
      "Mineral processing and metallurgy",
      "Materials science and testing",
      "Mining safety and environmental impact",
    ],
    icon: Mountain,
    bg: "#E8E4DC",
    fg: "#6B5B3F",
  },
];

export function getDepartmentByCode(code) {
  return DEPARTMENTS.find((d) => d.code === code);
}
