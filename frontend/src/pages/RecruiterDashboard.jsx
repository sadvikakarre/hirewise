import React, { useState, useEffect } from "react";
import { jobsAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", location: "", experience_min: 0 });
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.list().then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const handleCreateJob = async () => {
    setPosting(true);
    try {
      const res = await jobsAPI.create(form);
      setJobs([...jobs, res.data]);
      setForm({ title: "", description: "", location: "", experience_min: 0 });
      setMessage("success:Job posted successfully!");
    } catch {
      setMessage("error:Failed to post job");
    }
    setPosting(false);
  };

  const handleViewApplications = async (job) => {
    setSelectedJob(job);
    try {
      const res = await jobsAPI.getApplications(job.id);
      setApplications(res.data);
    } catch {
      setMessage("error:Failed to load applications");
    }
  };

  const [msgType, msgText] = message ? message.split(/:(.+)/) : ["", ""];

  const statusConfig = {
    select: { color: "#10B981", bg: "#0A1A12", border: "#10B981", label: "✅ SELECT" },
    reject: { color: "#EF4444", bg: "#1A0A0A", border: "#EF4444", label: "❌ REJECT" },
    review: { color: "#F59E0B", bg: "#1A1400", border: "#F59E0B", label: "🔍 REVIEW" },
    pending: { color: "#8B8BA7", bg: "#1A1A24", border: "#2A2A3A", label: "⏳ PENDING" },
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.navLogo}>
            <span style={s.navLogoIcon}>⚡</span>
            <span style={s.navLogoText}>HireWise</span>
          </div>
          <span style={s.navBadge}>Recruiter</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navUser}>👋 {user?.name}</span>
          <button style={s.logoutBtn} onClick={() => { logout(); navigate("/login"); }}>Sign out</button>
        </div>
      </nav>

      <div style={s.content}>
        {msgText && (
          <div style={{...s.toast, ...(msgType === "success" ? s.toastSuccess : s.toastError)}}>
            {msgType === "success" ? "✅" : "❌"} {msgText}
          </div>
        )}

        <div style={s.grid}>
          {/* Post Job */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>📝</div>
              <div>
                <h2 style={s.cardTitle}>Post a Job</h2>
                <p style={s.cardSub}>Fill in the details below</p>
              </div>
            </div>
            <div style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Job Title</label>
                <input style={s.input} placeholder="e.g. Python Developer" value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  onFocus={e => e.target.style.borderColor = "#06B6D4"}
                  onBlur={e => e.target.style.borderColor = "#1E1E2E"} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Job Description</label>
                <textarea style={{...s.input, height: "110px", resize: "vertical"}}
                  placeholder="Describe the role and requirements..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  onFocus={e => e.target.style.borderColor = "#06B6D4"}
                  onBlur={e => e.target.style.borderColor = "#1E1E2E"} />
              </div>
              <div style={s.row}>
                <div style={{...s.field, flex: 1}}>
                  <label style={s.label}>Location</label>
                  <input style={s.input} placeholder="e.g. Hyderabad" value={form.location}
                    onChange={e => setForm({...form, location: e.target.value})}
                    onFocus={e => e.target.style.borderColor = "#06B6D4"}
                    onBlur={e => e.target.style.borderColor = "#1E1E2E"} />
                </div>
                <div style={{...s.field, flex: 1}}>
                  <label style={s.label}>Min Experience (yrs)</label>
                  <input style={s.input} type="number" placeholder="0" value={form.experience_min}
                    onChange={e => setForm({...form, experience_min: e.target.value})}
                    onFocus={e => e.target.style.borderColor = "#06B6D4"}
                    onBlur={e => e.target.style.borderColor = "#1E1E2E"} />
                </div>
              </div>
              <button style={{...s.btn, opacity: posting ? 0.7 : 1}} onClick={handleCreateJob} disabled={posting}>
                {posting ? "Posting..." : "🚀 Post Job"}
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>💼</div>
              <div>
                <h2 style={s.cardTitle}>My Job Postings</h2>
                <p style={s.cardSub}>{jobs.length} active jobs</p>
              </div>
            </div>
            {jobs.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>📋</div>
                <p style={s.emptyText}>No jobs posted yet</p>
              </div>
            ) : (
              <div style={s.jobsList}>
                {jobs.map(job => (
                  <div key={job.id}
                    style={{...s.jobCard, ...(selectedJob?.id === job.id ? s.jobCardActive : {})}}>
                    <div style={s.jobTop}>
                      <div>
                        <div style={s.jobTitle}>{job.title}</div>
                        <div style={s.jobMeta}>
                          <span style={s.jobMetaTag}>📍 {job.location || "Remote"}</span>
                          <span style={s.jobMetaTag}>⏱ {job.experience_min}+ yrs</span>
                        </div>
                      </div>
                      <button style={s.viewBtn} onClick={() => handleViewApplications(job)}>
                        👥 View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Applications */}
        {selectedJob && (
          <div style={{...s.card, marginTop: "1.5rem"}}>
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>🤖</div>
              <div>
                <h2 style={s.cardTitle}>AI Rankings — {selectedJob.title}</h2>
                <p style={s.cardSub}>{applications.length} applications • sorted by match score</p>
              </div>
            </div>
            {applications.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>📭</div>
                <p style={s.emptyText}>No applications yet</p>
              </div>
            ) : (
              <div style={s.appGrid}>
                {applications.map((app, i) => {
                  const sc = statusConfig[app.status] || statusConfig.pending;
                  return (
                    <div key={app.id} style={s.appCard}>
                      <div style={s.appTop}>
                        <div style={s.appRank}>#{i + 1}</div>
                        <div style={s.appInfo}>
                          <div style={s.appName}>{app.candidate_name}</div>
                          <div style={s.appEmail}>{app.candidate_email}</div>
                        </div>
                        <div style={s.appRight}>
                          <div style={s.scoreVal}>{app.match_score}%</div>
                          <div style={{...s.badge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`}}>
                            {sc.label}
                          </div>
                        </div>
                      </div>
                      <div style={s.reasoning}>{app.ai_reasoning}</div>
                      <div style={s.appBottom}>
                        <div>
                          <div style={s.miniLabel}>💪 Strengths</div>
                          <div style={s.tagWrap}>
                            {JSON.parse(app.strengths || "[]").slice(0, 3).map(t => (
                              <span key={t} style={{...s.tag, background: "#0A1A12", color: "#10B981", border: "1px solid #1A3A2A"}}>{t}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={s.miniLabel}>⚠️ Gaps</div>
                          <div style={s.tagWrap}>
                            {JSON.parse(app.weaknesses || "[]").slice(0, 2).map(t => (
                              <span key={t} style={{...s.tag, background: "#1A0A0A", color: "#EF4444", border: "1px solid #3A1A1A"}}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
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
  content: { padding: "2rem", maxWidth: "1200px", margin: "0 auto" },
  toast: { padding: "0.875rem 1.25rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" },
  toastSuccess: { background: "#0A1A12", border: "1px solid #10B981", color: "#10B981" },
  toastError: { background: "#1A0A0A", border: "1px solid #EF4444", color: "#EF4444" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  card: { background: "#111118", border: "1px solid #1E1E2E", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" },
  cardHeader: { display: "flex", alignItems: "center", gap: "0.875rem" },
  cardIcon: { width: "42px", height: "42px", background: "#0A1A1E", border: "1px solid #1E2E30", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" },
  cardTitle: { fontSize: "1rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.15rem" },
  cardSub: { fontSize: "0.8rem", color: "#8B8BA7" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  row: { display: "flex", gap: "1rem" },
  label: { fontSize: "0.8rem", fontWeight: "500", color: "#A0A0B8", letterSpacing: "0.2px" },
  input: { padding: "0.8rem 1rem", background: "#0D0D18", border: "1px solid #1E1E2E", borderRadius: "10px", fontSize: "0.875rem", color: "#FFFFFF", outline: "none", transition: "border-color 0.2s", fontFamily: "'Inter', sans-serif", width: "100%" },
  btn: { padding: "0.875rem", background: "linear-gradient(135deg, #06B6D4, #0891B2)", borderRadius: "10px", border: "none", color: "#FFFFFF", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 20px rgba(6,182,212,0.2)", fontFamily: "'Inter', sans-serif" },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 0", gap: "0.5rem" },
  emptyIcon: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  emptyText: { fontSize: "0.9rem", fontWeight: "500", color: "#E0E0F0" },
  jobsList: { display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "400px", overflowY: "auto" },
  jobCard: { background: "#0D0D18", border: "1px solid #1E1E2E", borderRadius: "12px", padding: "1rem 1.125rem", cursor: "pointer", transition: "all 0.2s" },
  jobCardActive: { border: "1px solid #06B6D4", background: "#0A1A1E", boxShadow: "0 0 12px rgba(6,182,212,0.1)" },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  jobTitle: { fontSize: "0.9rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.35rem" },
  jobMeta: { display: "flex", gap: "0.5rem" },
  jobMetaTag: { fontSize: "0.75rem", color: "#8B8BA7", background: "#1A1A24", padding: "0.2rem 0.5rem", borderRadius: "5px" },
  viewBtn: { padding: "0.4rem 0.875rem", background: "#0A1A1E", border: "1px solid #06B6D4", borderRadius: "7px", color: "#06B6D4", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  appGrid: { display: "flex", flexDirection: "column", gap: "1rem" },
  appCard: { background: "#0D0D18", border: "1px solid #1E1E2E", borderRadius: "12px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" },
  appTop: { display: "flex", alignItems: "center", gap: "1rem" },
  appRank: { width: "32px", height: "32px", background: "#0A1A1E", border: "1px solid #1E2E30", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "700", color: "#06B6D4" },
  appInfo: { flex: 1 },
  appName: { fontSize: "0.95rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.15rem" },
  appEmail: { fontSize: "0.8rem", color: "#8B8BA7" },
  appRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" },
  scoreVal: { fontSize: "1.5rem", fontWeight: "700", color: "#06B6D4", letterSpacing: "-0.5px" },
  badge: { padding: "0.2rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" },
  reasoning: { fontSize: "0.85rem", color: "#A0A0B8", lineHeight: "1.6", background: "#0A0A0F", padding: "0.875rem 1rem", borderRadius: "8px", border: "1px solid #1E1E2E" },
  appBottom: { display: "flex", gap: "2rem" },
  miniLabel: { fontSize: "0.72rem", fontWeight: "600", color: "#8B8BA7", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.4rem" },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
  tag: { padding: "0.2rem 0.6rem", borderRadius: "5px", fontSize: "0.75rem", fontWeight: "500" },
};