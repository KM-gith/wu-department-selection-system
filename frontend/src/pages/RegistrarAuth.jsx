import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Panel, Field, PrimaryButton, inputClass } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function RegistrarAuth() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginRegistrar, registerRegistrar } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ email: "", name: "", password: "", adminKey: "" });

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginRegistrar(loginForm.email, loginForm.password);
      navigate("/admin");
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
      await registerRegistrar(regForm);
      navigate("/admin");
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
                mode === m ? "border-gold text-gold font-semibold" : "border-transparent text-inksoft"
              }`}
            >
              {m === "login" ? "Sign in" : "Register (staff only)"}
            </button>
          ))}
        </div>

        {error && <div className="bg-rust-soft text-rust text-sm rounded px-3 py-2.5 mb-4">{error}</div>}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <Field label="Email">
              <input className={inputClass} type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
            </Field>
            <Field label="Password">
              <input className={inputClass} type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
            </Field>
            <PrimaryButton type="submit" disabled={loading}>
              Sign in <ArrowRight size={15} />
            </PrimaryButton>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <p className="text-xs text-inksoft mb-4">
              Registration requires the admin signup key configured on the server (<code>ADMIN_SIGNUP_KEY</code>).
              Share it only with staff who should have registrar access.
            </p>
            <Field label="Full name">
              <input className={inputClass} value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required />
            </Field>
            <Field label="Email">
              <input className={inputClass} type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
            </Field>
            <Field label="Password">
              <input className={inputClass} type="password" minLength={6} value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required />
            </Field>
            <Field label="Admin signup key">
              <input className={inputClass} type="password" value={regForm.adminKey} onChange={(e) => setRegForm({ ...regForm, adminKey: e.target.value })} required />
            </Field>
            <PrimaryButton type="submit" disabled={loading}>
              Create staff account <ArrowRight size={15} />
            </PrimaryButton>
          </form>
        )}
      </Panel>
    </div>
  );
}
