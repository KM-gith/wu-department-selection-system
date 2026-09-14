import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user || user.role !== role) return <Navigate to="/" replace />;
  return children;
}
