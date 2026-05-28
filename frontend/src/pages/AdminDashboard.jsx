import React, { useState, useEffect } from "react";
import { jobsAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.list().then(r => setJobs(r.data)).catch(() => {});
  }, []);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.navLogo}>
            <span style={s.navLogoIcon}>⚡</span>
            <span style={s.navLogoText}>HireWise</span>
          </div>
          <span style={{...s.navBadge, color: "#F59E0B", border: "1px solid #F59E0B", background: "#1A1400"}}>Admin</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navUser}>👋 {user?.name}</span>
          <button style={s.logoutBtn} onClick={() => { logout(); navigate("/login"); }}>Sign out</button>
        </div>
      </nav>

      <div style={s.content}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Platform Overview</h1>
          <p style={s.pageSub}>Monitor all activity across HireWise</p>
        </div>

        <div style={s.statsGrid}>
          {[
            { icon: "💼", label: "Total Jobs", value: jobs.length, color: "#06B6D4" },
            { icon: "🤖", label: "AI Powered", value: "100%", color: "#8B5CF6" },
            { icon: "⚡", label: "Avg Response", value: "<2s", color: "#10B981" },
            { icon: "🎯", label: "Accuracy", value: "95%", color: "#F59E0B" },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{...s.statIcon, color: stat.color}}>{stat.icon}</div>
              <div style={{...s.statVal, color: stat.color}}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardIcon}>📋</div>
            <div>
              <h2 style={s.cardTitle}>All Job Postings</h2>
              <p style={s.cardSub}>{jobs.length} total jobs on platform</p>
            </div>
          </div>
          {jobs.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>📭</div>
              <p style={s.emptyText}>No jobs posted yet</p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  {["#", "Job Title", "Location", "Min Experience", "Status"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={job.id} style={s.tr}>
                    <td style={s.td}>{i + 1}</td>
                    <td style={{...s.td, fontWeight: "600", color: "#FFFFFF"}}>{job.title}</td>
                    <td style={s.td}>{job.location || "Remote"}</td>
                    <td style={s.td}>{job.experience_min}+ years</td>
                    <td style={s.td}>
                      <span style={s.activeBadge}>🟢 Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0A0A0F", fontFamily: "'Inter', sans-serif", color: "#FFFFFF" },
  nav: { background: "#0D0D18", borderBottom: "1px solid #1E1E2E", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  navLogo: { display: "flex", alignItems: "center", gap: "0.6rem" },
  navLogoIcon: { fontSize: "1.2rem", background: "linear-gradient(135deg, #06B6D4, #0891B2)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" },
  navLogoText: { fontSize: "1.1rem", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.3px" },
  navBadge: { padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "600" },
  navRight: { display: "flex", alignItems: "center", gap: "1rem" },
  navUser: { fontSize: "0.875rem", color: "#8B8BA7" },
  logoutBtn: { padding: "0.4rem 1rem", background: "#1A1A24", border: "1px solid #2A2A3A", borderRadius: "8px", color: "#A0A0B8", fontSize: "0.825rem", cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  content: { padding: "2rem", maxWidth: "1100px", margin: "0 auto" },
  pageHeader: { marginBottom: "2rem" },
  pageTitle: { fontSize: "1.6rem", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.5px", marginBottom: "0.3rem" },
  pageSub: { fontSize: "0.875rem", color: "#8B8BA7" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  statCard: { background: "#111118", border: "1px solid #1E1E2E", borderRadius: "14px", padding: "1.5rem", textAlign: "center" },
  statIcon: { fontSize: "1.75rem", marginBottom: "0.75rem" },
  statVal: { fontSize: "2rem", fontWeight: "700", letterSpacing: "-1px", marginBottom: "0.25rem" },
  statLabel: { fontSize: "0.8rem", color: "#8B8BA7" },
  card: { background: "#111118", border: "1px solid #1E1E2E", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" },
  cardHeader: { display: "flex", alignItems: "center", gap: "0.875rem" },
  cardIcon: { width: "42px", height: "42px", background: "#1A1400", border: "1px solid #2A2400", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" },
  cardTitle: { fontSize: "1rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.15rem" },
  cardSub: { fontSize: "0.8rem", color: "#8B8BA7" },
  emptyState: { textAlign: "center", padding: "2rem 0" },
  emptyIcon: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  emptyText: { fontSize: "0.9rem", color: "#8B8BA7" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#8B8BA7", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E1E2E" },
  tr: { borderBottom: "1px solid #1A1A24" },
  td: { padding: "1rem", fontSize: "0.875rem", color: "#A0A0B8" },
  activeBadge: { background: "#0A1A12", color: "#10B981", border: "1px solid #1A3A2A", padding: "0.25rem 0.75rem", borderRadius: "6px", fontSize: "0.775rem", fontWeight: "600" },
};