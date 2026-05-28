import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/recruiter" element={
          <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } />

        <Route path="/candidate" element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/jobs" element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <JobsPage />
          </ProtectedRoute>
        } />

        <Route path="/jobs/:id" element={
          <ProtectedRoute allowedRoles={["candidate", "recruiter", "admin"]}>
            <JobDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<div style={{padding:"2rem"}}>403 — Access Denied</div>} />
        <Route path="*" element={<div style={{padding:"2rem"}}>404 — Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
