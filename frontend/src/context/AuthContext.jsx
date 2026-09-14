import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wu_dss_user");
    if (stored) setUser(JSON.parse(stored));
    setReady(true);
  }, []);

  const loginStudent = useCallback(async (studentIdNumber, password) => {
    const { data } = await client.post("/auth/login", { identifier: studentIdNumber, password });
    localStorage.setItem("wu_dss_token", data.token);
    localStorage.setItem("wu_dss_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const loginRegistrar = useCallback(async (email, password) => {
    const { data } = await client.post("/auth/login", { identifier: email, password });
    localStorage.setItem("wu_dss_token", data.token);
    localStorage.setItem("wu_dss_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const registerStudent = useCallback(async (payload) => {
    const { data } = await client.post("/auth/register-student", payload);
    localStorage.setItem("wu_dss_token", data.token);
    localStorage.setItem("wu_dss_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const registerRegistrar = useCallback(async (payload) => {
    const { data } = await client.post("/auth/register-registrar", payload);
    localStorage.setItem("wu_dss_token", data.token);
    localStorage.setItem("wu_dss_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("wu_dss_token");
    localStorage.removeItem("wu_dss_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, loginStudent, loginRegistrar, registerStudent, registerRegistrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
