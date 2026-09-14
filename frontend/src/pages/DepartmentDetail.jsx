import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Users } from "lucide-react";
import { Panel, PrimaryButton, GhostButton } from "../components/ui";
import { getDepartmentByCode } from "../data/departments.jsx";
import client from "../api/client";

export default function DepartmentDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const meta = getDepartmentByCode(code);

  const [live, setLive] = useState(null); // { capacity } from the API, if reachable
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    client
      .get("/departments")
      .then(({ data }) => {
        if (cancelled) return;
        const dept = data.departments.find((d) => d.code === code);
        setLive(dept || null);
      })
      .catch(() => setLive(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!meta) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <p className="text-inksoft mb-4">That department couldn't be found.</p>
        <GhostButton onClick={() => navigate("/")}>
          <ArrowLeft size={14} /> Back to home
        </GhostButton>
      </div>
    );
  }

  const Icon = meta.icon;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 pb-16">
      <Link to="/" className="text-sm text-inksoft inline-flex items-center gap-1.5 mb-6 hover:text-navy">
        <ArrowLeft size={14} /> Back to all departments
      </Link>

      <div className="flex items-start gap-4 mb-6 flex-wrap">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
          <Icon size={28} color={meta.fg} />
        </div>
        <div>
          <div className="font-display text-2xl md:text-3xl font-bold text-navy">{meta.name}</div>
          <p className="text-sm text-inksoft mt-1">{meta.blurb}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Panel className="p-6 mb-5">
            <div className="font-semibold mb-2">About this department</div>
            <p className="text-sm text-inksoft leading-relaxed">{meta.description}</p>
          </Panel>

          <Panel className="p-6">
            <div className="font-semibold mb-3">What you'll study</div>
            <ul className="space-y-2.5">
              {meta.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-inksoft">
                  <CheckCircle2 size={16} color={meta.fg} className="mt-0.5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div>
          <Panel className="p-5 mb-5">
            <div className="flex items-center gap-2 text-inksoft text-xs font-semibold mb-2">
              <Users size={14} /> SEAT CAPACITY
            </div>
            {loading ? (
              <div className="text-sm text-inksoft">Loading…</div>
            ) : live ? (
              <div className="font-display text-3xl font-bold text-navy">{live.capacity}</div>
            ) : (
              <div className="text-xs text-inksoft">Capacity is set by the registrar and will show once the system is connected.</div>
            )}
            <p className="text-xs text-inksoft mt-2">Seats approved by the dean for this admission cycle.</p>
          </Panel>

          <PrimaryButton className="w-full justify-center mb-2.5" onClick={() => navigate("/login/student")}>
            Apply as a student <ArrowRight size={15} />
          </PrimaryButton>
          <GhostButton className="w-full justify-center" onClick={() => navigate("/")}>
            Compare other departments
          </GhostButton>
        </div>
      </div>
    </div>
  );
}
