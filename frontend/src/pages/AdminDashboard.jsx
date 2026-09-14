import React, { useState } from "react";
import { ShieldCheck, Users, RefreshCw, BarChart3, MessageSquareWarning } from "lucide-react";
import CapacityTab from "../components/admin/CapacityTab";
import StudentsTab from "../components/admin/StudentsTab";
import PlacementTab from "../components/admin/PlacementTab";
import ChartsTab from "../components/admin/ChartsTab";
import ComplaintsTab from "../components/admin/ComplaintsTab";

const TABS = [
  { key: "capacity", label: "Capacity", icon: ShieldCheck },
  { key: "students", label: "Students", icon: Users },
  { key: "placement", label: "Run Placement", icon: RefreshCw },
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "complaints", label: "Appeals", icon: MessageSquareWarning },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("capacity");

  return (
    <div className="max-w-4xl mx-auto px-5 py-7 pb-16">
      <div className="flex gap-1 border-b border-hairline mb-6 flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm -mb-px border-b-2 ${
                active ? "border-navy text-navy font-bold" : "border-transparent text-inksoft font-medium"
              }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "capacity" && <CapacityTab />}
      {tab === "students" && <StudentsTab />}
      {tab === "placement" && <PlacementTab />}
      {tab === "dashboard" && <ChartsTab />}
      {tab === "complaints" && <ComplaintsTab />}
    </div>
  );
}
