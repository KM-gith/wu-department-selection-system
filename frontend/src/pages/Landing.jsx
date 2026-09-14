import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Landmark, ArrowRight,
  MapPin, Mail, Phone as PhoneIcon,
} from "lucide-react";
import { Panel } from "../components/ui";
import { DEPARTMENTS } from "../data/departments.jsx";
import heroPhoto from "../assets/wu-hero.jpg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden min-h-[460px] flex items-center">
        <img
          src={heroPhoto}
          alt="Wallaga University campus"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/10" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 py-16 w-full">
          <div className="max-w-md">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight text-navy mb-2">
              WELCOME TO
              <br />
              DEPARTMENT SELECTION SYSTEM
            </h1>
            <div className="w-14 h-1 bg-rust my-4" />
            <p className="text-inksoft text-base leading-relaxed mb-7">
              This system helps Pre-Engineering students view available departments, check
              requirements and capacity, select their preferred departments, and track their
              allocation status.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-rust text-white font-bold text-sm rounded px-5 py-3 hover:opacity-90 transition-opacity"
              >
                <LogInIcon /> LOGIN TO GET STARTED
              </button>
         
            </div>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div id="departments" className="max-w-6xl mx-auto px-5 py-14">
        <div className="text-center mb-9">
          <div className="flex items-center justify-center gap-2.5 text-navy">
            <Landmark size={22} />
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-wide">AVAILABLE DEPARTMENTS</h2>
          </div>
          <p className="text-inksoft text-sm mt-1.5">View details of all departments</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {DEPARTMENTS.map((d) => {
            const Icon = d.icon;
            return (
              <Panel key={d.code} className="p-6 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3.5 flex items-center justify-center" style={{ background: d.bg }}>
                  <Icon size={20} color={d.fg} />
                </div>
                <div className="font-display font-bold text-base text-navy mb-1.5 leading-snug">{d.name}</div>
                <p className="text-xs text-inksoft leading-relaxed mb-3.5">{d.blurb}</p>
                <button
                  onClick={() => navigate(`/departments/${d.code}`)}
                  className="text-rust text-xs font-bold inline-flex items-center gap-1.5"
                >
                  View details <ArrowRight size={12} />
                </button>
              </Panel>
            );
          })}
        </div>
      </div>

      {/* About */}
      <div id="about" className="bg-paperraised border-y border-hairline">
        <div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-navy mb-3">About this system</h3>
            <p className="text-sm text-inksoft leading-relaxed mb-3">
              Pre-engineering students rank Computer Science, Civil Engineering, Electrical and Computer Engineering, Mechanical engineering, Chemical Engineering, Water Resource & Environmental Engineering, Architecture, Mining & Materials Engineering, Information Technology, and
              Information System in order of preference. The registrar reviews capacity,
              runs the allocation, and publishes results once approved.
            </p>
            <p className="text-sm text-inksoft leading-relaxed">
              Placement considers CGPA, preference order, department capacity, and an
              affirmative-action weighting for female students and students with disability,
              consistent with university policy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Departments", value: "10" },
              { label: "Selection basis", value: "CGPA + Preference" },
              { label: "Roles", value: "Student / Registrar" },
              { label: "Academic year", value: "2025/2026" },
            ].map((s) => (
              <Panel key={s.label} className="p-4">
                <div className="text-xs text-inksoft mb-1">{s.label}</div>
                <div className="font-display font-bold text-navy">{s.value}</div>
              </Panel>
            ))}
          </div>
        </div>
      </div>

      {/* Get started (role picker) */}
      <div id="get-started" className="max-w-4xl mx-auto px-5 py-14">
        <h3 className="font-display text-2xl font-bold text-navy text-center mb-8">Get started</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Panel className="p-6 cursor-pointer hover:border-navy transition-colors" onClick={() => navigate("/login/student")}>
            <GraduationCap size={26} color="#1F3A5F" />
            <div className="font-display text-xl font-semibold mt-3.5 mb-1.5">I'm a student</div>
            <p className="text-sm text-inksoft leading-relaxed mb-4">
              Sign in with your student ID, rank the three departments, and check your allocation once it's published.
            </p>
            <span className="text-sm font-semibold text-navy inline-flex items-center gap-1.5">
              Continue <ArrowRight size={14} />
            </span>
          </Panel>
          <Panel className="p-6 cursor-pointer hover:border-gold transition-colors" onClick={() => navigate("/login/registrar")}>
            <Landmark size={26} color="#B8862F" />
            <div className="font-display text-xl font-semibold mt-3.5 mb-1.5">Registrar / Dean</div>
            <p className="text-sm text-inksoft leading-relaxed mb-4">
              Set department capacity, review applicants, run the allocation, and publish results.
            </p>
            <span className="text-sm font-semibold text-gold inline-flex items-center gap-1.5">
              Continue <ArrowRight size={14} />
            </span>
          </Panel>
        </div>
      </div>

      {/* Contact / footer strip */}
      <div id="contact" className="bg-navy text-white/90">
        <div className="max-w-6xl mx-auto px-5 py-8 grid sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-2.5">
            <PhoneIcon size={16} className="mt-0.5 text-gold-soft" />
            <div>
              <div>Registrar's office</div>
              <div className="text-white/60 text-xs">+251900000000</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail size={16} className="mt-0.5 text-gold-soft" />
            <div>
              <div>Email support</div>
              <div className="text-white/60 text-xs">wallagauniversity@gmail.com</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="mt-0.5 text-gold-soft" />
            <div>
              <div>Wallaga University</div>
              <div className="text-white/60 text-xs">Nekemte, Ethiopia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}
function Info14() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
