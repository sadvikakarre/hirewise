import React, { useState, useEffect } from "react";
import { candidateAPI, jobsAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function CandidateDashboard() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    candidateAPI.getProfile().then(r => setProfile(r.data)).catch(() => {});
    jobsAPI.list().then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const res = await candidateAPI.uploadResume(file);
      setProfile(res.data);
      setMessage("success:Resume uploaded and parsed by AI!");
    } catch {
      setMessage("error:Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    setMessage("");
    try {
      await jobsAPI.apply(jobId);
      setMessage("success:Applied! AI has ranked your profile.");
    } catch (err) {
      setMessage("error:" + (err.response?.data?.detail || "Application failed"));
    }
    setApplying(null);
  };

  const skills = profile ? JSON.parse(profile.skills || "[]") : [];
  const [msgType, msgText] = message ? message.split(/:(.+)/) : ["", ""];

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.navLogo}>
            <span style={s.navLogoIcon}>⚡</span>
            <span style={s.navLogoText}>HireWise</span>
          </div>
          <span style={s.navBadge}>Candidate</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navUser}>👋 {user?.name}</span>
          <button style={s.logoutBtn} onClick={() => { logout(); navigate("/login"); }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={s.content}>
        {msgText && (
          <div style={{...s.toast, ...(msgType === "success" ? s.toastSuccess : s.toastError)}}>
            {msgType === "success" ? "✅" : "❌"} {msgText}
          </div>
        )}

        <div style={s.grid}>
          {/* Profile Card */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>👤</div>
              <div>
                <h2 style={s.cardTitle}>My Profile</h2>
                <p style={s.cardSub}>AI-parsed resume data</p>
              </div>
            </div>

            {profile ? (
              <div style={s.profileData}>
                <div style={s.statRow}>
                  <div style={s.stat}>
                    <div style={s.statVal}>{profile.experience_years || 0}</div>
                    <div style={s.statLabel}>Years Exp.</div>
                  </div>
                  <div style={s.statDivider} />
                  <div style={s.stat}>
                    <div style={s.statVal}>{skills.length}</div>
                    <div style={s.statLabel}>Skills Found</div>
                  </div>
                </div>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>🎓 Education</span>
                  <span style={s.infoVal}>{profile.education || "—"}</span>
                </div>
                <div style={s.skillsSection}>
                  <span style={s.infoLabel}>🛠 Skills</span>
                  <div style={s.skillsWrap}>
                    {skills.slice(0, 10).map(sk => (
                      <span key={sk} style={s.skillTag}>{sk}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>📄</div>
                <p style={s.emptyText}>No resume uploaded yet</p>
                <p style={s.emptySub}>Upload your resume to get started</p>
              </div>
            )}

            <label style={{...s.uploadBtn, opacity: uploading ? 0.6 : 1, cursor: uploading ? "not-allowed" : "pointer"}}>
              {uploading ? "⏳  Parsing with AI..." : "📤  Upload Resume (PDF / DOCX)"}
              <input type="file" accept=".pdf,.docx" onChange={handleUpload} style={{display:"none"}} disabled={uploading} />
            </label>
          </div>

          {/* Jobs Card */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>💼</div>
              <div>
                <h2 style={s.cardTitle}>Available Jobs</h2>
                <p style={s.cardSub}>{jobs.length} open positions</p>
              </div>
            </div>
            {jobs.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>🔍</div>
                <p style={s.emptyText}>No jobs available yet</p>
              </div>
            ) : (
              <div style={s.jobsList}>
                {jobs.map(job => (
                  <div key={job.id} style={s.jobCard}>
                    <div style={s.jobTop}>
                      <div>
                        <div style={s.jobTitle}>{job.title}</div>
                        <div style={s.jobMeta}>
                          <span style={s.jobMetaTag}>📍 {job.location || "Remote"}</span>
                          <span style={s.jobMetaTag}>⏱ {job.experience_min}+ yrs</span>
                        </div>
                      </div>
                      <button
                        style={{...s.applyBtn, opacity: applying === job.id ? 0.6 : 1}}
                        onClick={() => handleApply(job.id)}
                        disabled={applying === job.id}
                      >
                        {applying === job.id ? "..." : "⚡ Apply"}
                      </button>
                    </div>
                    <p style={s.jobDesc}>{job.description.slice(0, 110)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
  navBadge: { background: "#0A1A1E", color: "#06B6D4", border: "1px solid #06B6D4", padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "600" },
  navRight: { display: "flex", alignItems: "center", gap: "1rem" },
  navUser: { fontSize: "0.875rem", color: "#8B8BA7" },
  logoutBtn: { padding: "0.4rem 1rem", background: "#1A1A24", border: "1px solid #2A2A3A", borderRadius: "8px", color: "#A0A0B8", fontSize: "0.825rem", cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  content: { padding: "2rem", maxWidth: "1100px", margin: "0 auto" },
  toast: { padding: "0.875rem 1.25rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" },
  toastSuccess: { background: "#0A1A12", border: "1px solid #10B981", color: "#10B981" },
  toastError: { background: "#1A0A0A", border: "1px solid #EF4444", color: "#EF4444" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1.5rem" },
  card: { background: "#111118", border: "1px solid #1E1E2E", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" },
  cardHeader: { display: "flex", alignItems: "center", gap: "0.875rem" },
  cardIcon: { width: "42px", height: "42px", background: "#0A1A1E", border: "1px solid #1E2E30", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" },
  cardTitle: { fontSize: "1rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.15rem" },
  cardSub: { fontSize: "0.8rem", color: "#8B8BA7" },
  profileData: { display: "flex", flexDirection: "column", gap: "1rem" },
  statRow: { display: "flex", background: "#0D0D18", borderRadius: "10px", border: "1px solid #1E1E2E", overflow: "hidden" },
  stat: { flex: 1, padding: "1rem", textAlign: "center" },
  statDivider: { width: "1px", background: "#1E1E2E" },
  statVal: { fontSize: "1.8rem", fontWeight: "700", color: "#06B6D4", letterSpacing: "-1px" },
  statLabel: { fontSize: "0.75rem", color: "#8B8BA7", marginTop: "0.2rem" },
  infoRow: { display: "flex", flexDirection: "column", gap: "0.35rem" },
  infoLabel: { fontSize: "0.75rem", fontWeight: "600", color: "#8B8BA7", textTransform: "uppercase", letterSpacing: "0.5px" },
  infoVal: { fontSize: "0.875rem", color: "#E0E0F0" },
  skillsSection: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  skillsWrap: { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
  skillTag: { background: "#0A1A1E", color: "#06B6D4", border: "1px solid #1E3040", padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.775rem", fontWeight: "500" },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 0", gap: "0.5rem" },
  emptyIcon: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  emptyText: { fontSize: "0.9rem", fontWeight: "500", color: "#E0E0F0" },
  emptySub: { fontSize: "0.8rem", color: "#8B8BA7" },
  uploadBtn: { display: "block", textAlign: "center", padding: "0.875rem", background: "linear-gradient(135deg, #06B6D4, #0891B2)", borderRadius: "10px", color: "#FFFFFF", fontWeight: "600", fontSize: "0.875rem", boxShadow: "0 0 20px rgba(6,182,212,0.2)", marginTop: "auto" },
  jobsList: { display: "flex", flexDirection: "column", gap: "0.875rem", maxHeight: "520px", overflowY: "auto" },
  jobCard: { background: "#0D0D18", border: "1px solid #1E1E2E", borderRadius: "12px", padding: "1rem 1.125rem" },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.625rem" },
  jobTitle: { fontSize: "0.95rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.375rem" },
  jobMeta: { display: "flex", gap: "0.5rem" },
  jobMetaTag: { fontSize: "0.75rem", color: "#8B8BA7", background: "#1A1A24", padding: "0.2rem 0.5rem", borderRadius: "5px" },
  jobDesc: { fontSize: "0.8rem", color: "#8B8BA7", lineHeight: "1.5" },
  applyBtn: { padding: "0.45rem 0.875rem", background: "linear-gradient(135deg, #06B6D4, #0891B2)", border: "none", borderRadius: "7px", color: "#FFFFFF", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 0 12px rgba(6,182,212,0.2)", fontFamily: "'Inter', sans-serif" },
};