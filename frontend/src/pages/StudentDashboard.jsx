import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, MessageSquareWarning } from "lucide-react";
import { Panel, Pill, PrimaryButton, GhostButton, Field, inputClass } from "../components/ui";
import client from "../api/client";

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [published, setPublished] = useState(false);
  const [prefs, setPrefs] = useState([]);
  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [profileRes, deptRes] = await Promise.all([client.get("/students/me"), client.get("/departments")]);
      setProfile(profileRes.data.profile);
      setPublished(profileRes.data.published);
      setDepartments(deptRes.data.departments);
      const existing = profileRes.data.profile.preferences || [];
      const blanks = Array(deptRes.data.departments.length).fill("");
      existing.forEach((code, i) => {
        if (i < blanks.length) blanks[i] = code;
      });
      setPrefs(blanks);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function savePreferences() {
    setSaving(true);
    setError("");
    try {
      const finalPrefs = prefs.filter(Boolean);
      const { data } = await client.put("/students/me", { preferences: finalPrefs });
      setProfile(data.profile);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not save preferences.");
    } finally {
      setSaving(false);
    }
  }

  async function submitComplaint() {
    if (!complaintText.trim()) return;
    try {
      const { data } = await client.post("/students/me/complaint", { text: complaintText.trim() });
      setProfile(data.profile);
      setComplaintText("");
    } catch (err) {
      setError(err?.response?.data?.error || "Could not submit appeal.");
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-5 py-14 text-inksoft">Loading…</div>;
  if (!profile) return <div className="max-w-3xl mx-auto px-5 py-14 text-rust">{error}</div>;

  const usedDepts = prefs.filter(Boolean);
  const deptByCode = Object.fromEntries(departments.map((d) => [d.code, d]));
  const allRanked = departments.length > 0 && prefs.filter(Boolean).length === departments.length;

  return (
    <div className="max-w-3xl mx-auto px-5 py-9 pb-16">
      <div className="flex justify-between items-baseline mb-5">
        <div className="font-display text-2xl font-semibold">Welcome, {profile.user?.name?.split(" ")[0] || "Student"}</div>
        <Pill>{profile.studentIdNumber}</Pill>
      </div>

      {error && <div className="bg-rust-soft text-rust text-sm rounded px-3 py-2.5 mb-4">{error}</div>}

      {profile.assignedDept && published ? (
        <Panel className="p-6 mb-5" style={{ borderColor: "#3B6E58" }}>
          <div className="flex items-center gap-2.5 mb-2">
            <CheckCircle2 size={20} color="#3B6E58" />
            <div className="font-bold text-base">You've been placed</div>
          </div>
          <p className="text-sm mb-1">
            Department: <strong>{deptByCode[profile.assignedDept]?.name || profile.assignedDept}</strong>
          </p>
          <p className="text-xs text-inksoft">CGPA on record: {profile.cgpa.toFixed(2)}</p>

          <div className="mt-4 border-t border-hairline pt-4">
            <div className="font-semibold text-sm mb-2">Something wrong? File an appeal</div>
            {profile.complaint?.text ? (
              <Pill tone={profile.complaint.resolved ? "moss" : "gold"}>
                {profile.complaint.resolved ? "Appeal reviewed" : "Appeal submitted — pending review"}
              </Pill>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <input
                  className={`${inputClass} flex-1 min-w-[220px]`}
                  placeholder="e.g. My CGPA was recorded incorrectly"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                />
                <GhostButton tone="rust" onClick={submitComplaint}>
                  <MessageSquareWarning size={14} /> Submit
                </GhostButton>
              </div>
            )}
          </div>
        </Panel>
      ) : profile.submittedAt && !published ? (
        <Panel className="p-5 mb-5" style={{ background: "#F5EFDC", borderColor: "#B8862F" }}>
          <div className="flex items-center gap-2.5 text-sm">
            <Circle size={16} color="#B8862F" />
            Preferences submitted. Allocation hasn't been published yet — check back soon.
          </div>
        </Panel>
      ) : profile.submittedAt && published && !profile.assignedDept ? (
        <Panel className="p-5 mb-5 bg-rust-soft" style={{ borderColor: "#9C4A3C" }}>
          <div className="text-sm text-rust">
            None of your ranked choices had a seat left when allocation ran. Please contact the registrar.
          </div>
        </Panel>
      ) : null}

      {!profile.submittedAt && (
        <Panel className="p-6">
          <div className="font-semibold mb-1">Rank every department</div>
          <p className="text-xs text-inksoft mb-4">
            Put all {departments.length} departments in order of preference, from your top choice to your last.
            You'll be placed into the highest-ranked one that still has an open seat.
          </p>
          {departments.map((_, i) => (
            <Field key={i} label={`${ordinal(i + 1)} choice`}>
              <select
                className={inputClass}
                value={prefs[i] || ""}
                onChange={(e) => {
                  const next = [...prefs];
                  next[i] = e.target.value;
                  setPrefs(next);
                }}
              >
                <option value="">Select department…</option>
                {departments.map((d) => {
                  const takenElsewhere = usedDepts.includes(d.code) && prefs[i] !== d.code;
                  return (
                    <option key={d.code} value={d.code} disabled={takenElsewhere}>
                      {d.name} — capacity {d.capacity}{takenElsewhere ? " (already chosen)" : ""}
                    </option>
                  );
                })}
              </select>
            </Field>
          ))}
          <PrimaryButton onClick={savePreferences} disabled={saving || !allRanked}>
            {saving ? "Saving…" : `Submit ranking (${prefs.filter(Boolean).length}/${departments.length} ranked)`}
          </PrimaryButton>
        </Panel>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {departments.map((d) => (
          <Panel key={d.code} className="p-4">
            <div className="font-semibold text-sm">{d.name}</div>
            <div className="text-xs text-inksoft leading-snug my-1.5">{d.blurb}</div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
