import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Panel, Field, PrimaryButton, inputClass } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function StudentAuth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginStudent, registerStudent } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ studentId: "", password: "" });
  const [regForm, setRegForm] = useState({ studentIdNumber: "", name: "", password: "", cgpa: "", gender: "F", disability: false });

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginStudent(loginForm.studentId, loginForm.password);
      navigate("/student");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerStudent({
        ...regForm,
        cgpa: parseFloat(regForm.cgpa),
      });
      navigate("/student");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-14">
      <Panel className="p-7">
        <div className="flex gap-1 mb-6 border-b border-hairline">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3.5 py-2.5 text-sm -mb-px border-b-2 ${
                mode === m ? "border-navy text-navy font-semibold" : "border-transparent text-inksoft"
              }`}
            >
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {error && <div className="bg-rust-soft text-rust text-sm rounded px-3 py-2.5 mb-4">{error}</div>}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <Field label="Student ID">
              <input
                className={inputClass}
                value={loginForm.studentId}
                onChange={(e) => setLoginForm({ ...loginForm, studentId: e.target.value })}
                placeholder="e.g. WU/PE/0142/16"
                required
              />
            </Field>
            <Field label="Password">
              <input
                className={inputClass}
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </Field>
            <PrimaryButton type="submit" disabled={loading}>
              Sign in <ArrowRight size={15} />
            </PrimaryButton>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Field label="Student ID">
              <input
                className={inputClass}
                value={regForm.studentIdNumber}
                onChange={(e) => setRegForm({ ...regForm, studentIdNumber: e.target.value })}
                placeholder="e.g. WU/PE/0142/16"
                required
              />
            </Field>
            <Field label="Full name">
              <input className={inputClass} value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required />
            </Field>
            <Field label="Password">
              <input
                className={inputClass}
                type="password"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                minLength={6}
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CGPA (0–4)">
                <input
                  className={inputClass}
                  type="number" step="0.01" min="0" max="4"
                  value={regForm.cgpa}
                  onChange={(e) => setRegForm({ ...regForm, cgpa: e.target.value })}
                  required
                />
              </Field>
              <Field label="Gender">
                <select className={inputClass} value={regForm.gender} onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </select>
              </Field>
            </div>
            <Field label="Disability status">
              <select
                className={inputClass}
                value={regForm.disability ? "yes" : "no"}
                onChange={(e) => setRegForm({ ...regForm, disability: e.target.value === "yes" })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </Field>
            <PrimaryButton type="submit" disabled={loading}>
              Create account <ArrowRight size={15} />
            </PrimaryButton>
          </form>
        )}
      </Panel>
    </div>
  );
}
