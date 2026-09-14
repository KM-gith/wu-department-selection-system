import React, { useEffect, useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { Panel, Pill, GhostButton } from "../ui";
import client from "../../api/client";

export default function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await client.get("/students");
    setStudents(data.students);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function removeStudent(id) {
    await client.delete(`/students/${id}`);
    load();
  }

  async function addSampleBatch() {
    await client.post("/students/sample-batch");
    load();
  }

  if (loading) return <div className="text-inksoft text-sm">Loading…</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-3.5 flex-wrap gap-2.5">
        <div className="font-semibold">{students.length} applicant{students.length === 1 ? "" : "s"} on record</div>
        <GhostButton onClick={addSampleBatch}>
          <Sparkles size={14} /> Add 15 sample applicants
        </GhostButton>
      </div>
      <Panel className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-inksoft">
              <th className="px-3.5 py-2.5">ID</th>
              <th className="px-3.5 py-2.5">Name</th>
              <th className="px-3.5 py-2.5">CGPA</th>
              <th className="px-3.5 py-2.5">Gender</th>
              <th className="px-3.5 py-2.5">Disability</th>
              <th className="px-3.5 py-2.5">Preferences</th>
              <th className="px-3.5 py-2.5">Assigned</th>
              <th className="px-3.5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b border-hairline">
                <td className="px-3.5 py-2 font-mono text-xs">{s.studentIdNumber}</td>
                <td className="px-3.5 py-2">{s.user?.name}</td>
                <td className="px-3.5 py-2">{s.cgpa.toFixed(2)}</td>
                <td className="px-3.5 py-2">{s.gender}</td>
                <td className="px-3.5 py-2">{s.disability ? "Yes" : "—"}</td>
                <td className="px-3.5 py-2">{(s.preferences || []).join(" › ") || "—"}</td>
                <td className="px-3.5 py-2">{s.assignedDept ? <Pill tone="moss">{s.assignedDept}</Pill> : "—"}</td>
                <td className="px-3.5 py-2">
                  <button onClick={() => removeStudent(s._id)} className="text-rust" title="Remove">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3.5 py-6 text-center text-inksoft">No applicants yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
