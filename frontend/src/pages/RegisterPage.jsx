import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await authAPI.register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logoBox}><span style={s.logoIcon}>⚡</span></div>
          <h1 style={s.brandName}>HireWise</h1>
          <p style={s.brandSub}>Join thousands of recruiters and candidates using AI to find the perfect match.</p>
        </div>
        <div style={s.roleSection}>
          <p style={s.roleLabel}>Choose your role</p>
          {[
            { role: "candidate", icon: "👤", title: "Candidate", desc: "Upload resume & apply to jobs with AI ranking" },
            { role: "recruiter", icon: "🏢", title: "Recruiter", desc: "Post jobs & get AI-ranked candidate lists instantly" },
          ].map(r => (
            <div key={r.role} onClick={() => setForm({...form, role: r.role})}
              style={{...s.roleCard, ...(form.role === r.role ? s.roleCardActive : {})}}>
              <span style={s.roleIcon}>{r.icon}</span>
              <div>
                <div style={s.roleTitle}>{r.title}</div>
                <div style={s.roleDesc}>{r.desc}</div>
              </div>
              {form.role === r.role && <span style={s.roleCheck}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <div>
            <h2 style={s.title}>Create account</h2>
            <p style={s.subtitle}>Get started with HireWise for free</p>
          </div>
          {error && <div style={s.errorBox}><span>⚠️</span> {error}</div>}
          <div style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} placeholder="John Doe" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                onFocus={e => e.target.style.borderColor = "#06B6D4"}
                onBlur={e => e.target.style.borderColor = "#1E1E2E"} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input style={s.input} type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                onFocus={e => e.target.style.borderColor = "#06B6D4"}
                onBlur={e => e.target.style.borderColor = "#1E1E2E"} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                onFocus={e => e.target.style.borderColor = "#06B6D4"}
                onBlur={e => e.target.style.borderColor = "#1E1E2E"} />
            </div>
            <div style={s.field}>
              <label style={s.label}>I am a</label>
              <select style={s.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="candidate">👤 Candidate</option>
                <option value="recruiter">🏢 Recruiter</option>
              </select>
            </div>
            <button style={{...s.btn, opacity: loading ? 0.7 : 1}} onClick={handleRegister} disabled={loading}>
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </div>
          <p style={s.foot}>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#0A0A0F", fontFamily: "'Inter', sans-serif" },
  left: { flex: 1.2, background: "linear-gradient(160deg, #0D0D18 0%, #0A0A0F 100%)", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #1E1E2E" },
  brand: { marginBottom: "2rem" },
  logoBox: { width: "52px", height: "52px", background: "linear-gradient(135deg, #06B6D4, #0891B2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 0 24px rgba(6,182,212,0.3)" },
  logoIcon: { fontSize: "1.6rem" },
  brandName: { fontSize: "2rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.5px", marginBottom: "0.5rem" },
  brandSub: { fontSize: "0.9rem", color: "#8B8BA7", lineHeight: "1.6" },
  roleSection: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.75rem" },
  roleLabel: { fontSize: "0.8rem", fontWeight: "600", color: "#8B8BA7", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" },
  roleCard: { display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: "#111118", borderRadius: "12px", border: "1px solid #1E1E2E", cursor: "pointer", transition: "all 0.2s", position: "relative" },
  roleCardActive: { border: "1px solid #06B6D4", background: "#0A1A1E", boxShadow: "0 0 16px rgba(6,182,212,0.15)" },
  roleIcon: { fontSize: "1.5rem" },
  roleTitle: { fontSize: "0.95rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.2rem" },
  roleDesc: { fontSize: "0.8rem", color: "#8B8BA7", lineHeight: "1.4" },
  roleCheck: { position: "absolute", right: "1rem", color: "#06B6D4", fontWeight: "700", fontSize: "1rem" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#0A0A0F" },
  card: { width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "1.5rem" },
  title: { fontSize: "1.75rem", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.5px", marginBottom: "0.4rem" },
  subtitle: { fontSize: "0.9rem", color: "#8B8BA7" },
  errorBox: { background: "#1A0A0A", border: "1px solid #3A1A1A", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#EF4444", display: "flex", alignItems: "center", gap: "0.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label: { fontSize: "0.825rem", fontWeight: "500", color: "#A0A0B8", letterSpacing: "0.2px" },
  input: { padding: "0.8rem 1rem", background: "#111118", border: "1px solid #1E1E2E", borderRadius: "10px", fontSize: "0.95rem", color: "#FFFFFF", outline: "none", transition: "border-color 0.2s", width: "100%" },
  btn: { padding: "0.875rem", background: "linear-gradient(135deg, #06B6D4, #0891B2)", borderRadius: "10px", border: "none", color: "#FFFFFF", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 20px rgba(6,182,212,0.25)", marginTop: "0.25rem" },
  foot: { textAlign: "center", fontSize: "0.875rem", color: "#8B8BA7" },
  link: { color: "#06B6D4", fontWeight: "500", textDecoration: "none" },
};