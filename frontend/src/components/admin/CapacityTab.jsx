import React, { useEffect, useState } from "react";
import { Panel, Field, PrimaryButton, inputClass } from "../ui";
import client from "../../api/client";

export default function CapacityTab() {
  const [departments, setDepartments] = useState([]);
  const [weight, setWeight] = useState(0.15);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const [deptRes, settingsRes] = await Promise.all([client.get("/departments"), client.get("/settings")]);
    setDepartments(deptRes.data.departments);
    setWeight(settingsRes.data.settings.weight);
  }

  useEffect(() => {
    load();
  }, []);

  function updateLocal(code, capacity) {
    setDepartments(departments.map((d) => (d.code === code ? { ...d, capacity: parseInt(capacity || "0", 10) } : d)));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await Promise.all(departments.map((d) => client.put(`/departments/${d.code}`, { capacity: d.capacity })));
      await client.put("/settings", { weight: parseFloat(weight) || 0 });
      setMessage("Saved.");
    } catch (err) {
      setMessage(err?.response?.data?.error || "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Panel className="p-6 mb-4">
        <div className="font-semibold mb-1">Department capacity</div>
        <p className="text-xs text-inksoft mb-4">Set how many seats the dean has approved for each department.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {departments.map((d) => (
            <Field key={d.code} label={d.name}>
              <input type="number" min="0" className={inputClass} value={d.capacity} onChange={(e) => updateLocal(d.code, e.target.value)} />
            </Field>
          ))}
        </div>
      </Panel>
      <Panel className="p-6 mb-4">
        <div className="font-semibold mb-1">Affirmative action weight</div>
        <p className="text-xs text-inksoft mb-4">Added to CGPA for female students and students with disability before ranking.</p>
        <Field label="Weight (CGPA points)">
          <input type="number" step="0.01" min="0" max="1" className={`${inputClass} max-w-[180px]`} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
      </Panel>
      <div className="flex items-center gap-3">
        <PrimaryButton onClick={save} disabled={saving}>{saving ? "Saving…" : "Save settings"}</PrimaryButton>
        {message && <span className="text-xs text-inksoft">{message}</span>}
      </div>
    </div>
  );
}
