import React, { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import { Panel, Pill, GhostButton } from "../ui";
import client from "../../api/client";

export default function ComplaintsTab() {
  const [students, setStudents] = useState([]);

  async function load() {
    const { data } = await client.get("/students/complaints");
    setStudents(data.students);
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(id) {
    await client.put(`/students/${id}/resolve-complaint`);
    load();
  }

  return (
    <div>
      <div className="font-semibold mb-3.5">{students.length} appeal{students.length === 1 ? "" : "s"}</div>
      {students.length === 0 && (
        <Panel className="p-6 text-center text-inksoft text-sm">
          <ClipboardList size={20} className="mx-auto mb-2" />
          No appeals submitted yet.
        </Panel>
      )}
      {students.map((s) => (
        <Panel key={s._id} className="p-4.5 mb-3">
          <div className="flex justify-between items-start gap-3 flex-wrap">
            <div>
              <div className="font-semibold text-sm">
                {s.user?.name} <span className="text-inksoft font-normal">· {s.studentIdNumber}</span>
              </div>
              <div className="text-sm my-1.5">{s.complaint.text}</div>
              <div className="text-xs text-inksoft">Assigned: {s.assignedDept || "Not yet assigned"}</div>
            </div>
            {s.complaint.resolved ? (
              <Pill tone="moss">Resolved</Pill>
            ) : (
              <GhostButton tone="moss" onClick={() => resolve(s._id)}>
                <CheckCircle2 size={14} /> Mark resolved
              </GhostButton>
            )}
          </div>
        </Panel>
      ))}
    </div>
  );
}
