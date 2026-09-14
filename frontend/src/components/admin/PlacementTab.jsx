import React, { useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, Download } from "lucide-react";
import { Panel, Pill, PrimaryButton, GhostButton } from "../ui";
import client from "../../api/client";

function downloadCsv(filename, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function PlacementTab() {
  const [summary, setSummary] = useState([]);
  const [settings, setSettings] = useState({ published: false });
  const [students, setStudents] = useState([]);
  const [busy, setBusy] = useState(false);
  const [ranDraft, setRanDraft] = useState(false);

  async function load() {
    const [summaryRes, settingsRes, studentsRes] = await Promise.all([
      client.get("/placement/summary"),
      client.get("/settings"),
      client.get("/students"),
    ]);
    setSummary(summaryRes.data.summary);
    setSettings(settingsRes.data.settings);
    setStudents(studentsRes.data.students);
  }

  useEffect(() => {
    load();
  }, []);

  const readyCount = students.filter((s) => s.preferences && s.preferences.length === 3).length;

  async function handleRun() {
    setBusy(true);
    try {
      await client.post("/placement/run");
      setRanDraft(true);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    setBusy(true);
    try {
      await client.post("/placement/publish");
      setRanDraft(false);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function handleUnpublish() {
    setBusy(true);
    try {
      await client.post("/placement/unpublish");
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Panel className="p-6 mb-4">
        <div className="font-semibold mb-1.5">Allocation algorithm</div>
        <p className="text-sm text-inksoft leading-relaxed mb-4">
          Applicants are ranked by CGPA plus affirmative-action weight, highest first. Each applicant is placed
          into their highest-ranked choice that still has an open seat; if a department is full, the system falls
          through to the next choice. {readyCount} of {students.length} applicants have submitted all three
          preferences and are eligible.
        </p>
        <div className="flex gap-2.5 flex-wrap">
          <PrimaryButton onClick={handleRun} disabled={busy || readyCount === 0}>
            <RefreshCw size={15} /> Run placement (draft)
          </PrimaryButton>
          {ranDraft && (
            <GhostButton tone="moss" onClick={handlePublish} disabled={busy}>
              <CheckCircle2 size={14} /> Approve & publish
            </GhostButton>
          )}
          {settings.published && !ranDraft && (
            <GhostButton tone="rust" onClick={handleUnpublish} disabled={busy}>
              Unpublish
            </GhostButton>
          )}
        </div>
        <div className="mt-3">
          {settings.published && !ranDraft && <Pill tone="moss">Results are published to students</Pill>}
          {ranDraft && <Pill tone="gold">Draft — not yet visible to students</Pill>}
        </div>
      </Panel>

      <Panel className="p-5 mb-4">
        <div className="font-semibold mb-3">Seats filled</div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {summary.map((s) => (
            <div key={s.code} className="border border-hairline rounded p-3.5">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="font-display text-2xl font-bold text-navy my-1.5">{s.filled} / {s.capacity}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex justify-end">
        <GhostButton
          onClick={() =>
            downloadCsv("allocation-results.csv", [
              ["ID", "Name", "CGPA", "Gender", "Disability", "Preferences", "Assigned"],
              ...students.map((s) => [
                s.studentIdNumber, s.user?.name, s.cgpa, s.gender, s.disability ? "Yes" : "No",
                (s.preferences || []).join(" > "), s.assignedDept || "",
              ]),
            ])
          }
        >
          <Download size={14} /> Export CSV
        </GhostButton>
      </div>
    </div>
  );
}
