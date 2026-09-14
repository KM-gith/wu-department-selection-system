import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import DepartmentDetail from "./pages/DepartmentDetail";
import StudentAuth from "./pages/StudentAuth";
import RegistrarAuth from "./pages/RegistrarAuth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/departments/:code" element={<DepartmentDetail />} />
        <Route path="/login/student" element={<StudentAuth />} />
        <Route path="/login/registrar" element={<RegistrarAuth />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="registrar">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <footer className="text-center text-xs text-inksoft py-8">
        Department Selection System for Pre-Engineering Students — Wallaga University.
      </footer>
    </div>
  );
}
