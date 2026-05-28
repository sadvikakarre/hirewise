import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.login({ email, password });
      login(res.data);
      if (res.data.role === "recruiter") navigate("/recruiter");
      else if (res.data.role === "candidate") navigate("/candidate");
      else navigate("/admin");
    } catch {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logoBox}>
            <span style={s.logoIcon}>⚡</span>
          </div>
          <h1 style={s.brandName}>HireWise</h1>
          <p style={s.brandSub}>AI-Powered Recruitment Platform</p>
        </div>
        <div style={s.features}>
          {[
            { icon: "🤖", title: "AI Resume Parsing", desc: "Instant structured extraction from any resume" },
            { icon: "📊", title: "Smart Ranking", desc: "0-100 match score against job requirements" },
            { icon: "💡", title: "Explainable Decisions", desc: "Select / Reject / Review with clear reasoning" },
            { icon: "⚡", title: "Real-time Results", desc: "Instant AI decisions, no waiting" },
          ].map(f => (
            <div key={f.title} style={s.featureCard}>
              <span style={s.featureIcon}>{f.icon}</span>
              <div>
                <div style={s.featureTitle}>{f.title}</div>
                <div style={s.featureDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={s.leftFooter}>
          <div style={s.dot} /><div style={s.dot} /><div style={s.dotActive} />
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardTop}>
            <h2 style={s.title}>Welcome back</h2>
            <p style={s.subtitle}>Sign in to your HireWise account</p>
          </div>
          {error && (
            <div style={s.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}
          <div style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input
                style={s.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#06B6D4"}
                onBlur={e => e.target.style.borderColor = "#1E1E2E"}
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                style={s.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                onFocus={e => e.target.style.borderColor = "#06B6D4"}
                onBlur={e => e.target.style.borderColor = "#1E1E2E"}
              />
            </div>
            <button style={{...s.btn, opacity: loading ? 0.7 : 1}} onClick={handleLogin} disabled={loading}>
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign in →</span>
              )}
            </button>
          </div>
          <p style={s.foot}>
            Don't have an account?{" "}
            <Link to="/register" style={s.link}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", minHeight: "100vh", background: "#0A0A0F", fontFamily: "'Inter', sans-serif" },
  left: { flex: 1.2, background: "linear-gradient(160deg, #0D0D18 0%, #0A0A0F 100%)", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #1E1E2E" },
  brand: { marginBottom: "3rem" },
  logoBox: { width: "52px", height: "52px", background: "linear-gradient(135deg, #06B6D4, #0891B2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 0 24px rgba(6,182,212,0.3)" },
  logoIcon: { fontSize: "1.6rem" },
  brandName: { fontSize: "2rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.5px", marginBottom: "0.4rem" },
  brandSub: { fontSize: "0.95rem", color: "#8B8BA7", fontWeight: "400" },
  features: { display: "flex", flexDirection: "column", gap: "1rem", flex: 1, justifyContent: "center" },
  featureCard: { display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem 1.25rem", background: "#111118", borderRadius: "12px", border: "1px solid #1E1E2E" },
  featureIcon: { fontSize: "1.3rem", marginTop: "2px" },
  featureTitle: { fontSize: "0.9rem", fontWeight: "600", color: "#FFFFFF", marginBottom: "0.2rem" },
  featureDesc: { fontSize: "0.8rem", color: "#8B8BA7", lineHeight: "1.4" },
  leftFooter: { display: "flex", gap: "6px", alignItems: "center", marginTop: "2rem" },
  dot: { width: "6px", height: "6px", borderRadius: "50%", background: "#2A2A3A" },
  dotActive: { width: "20px", height: "6px", borderRadius: "3px", background: "#06B6D4" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#0A0A0F" },
  card: { width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "1.5rem" },
  cardTop: { marginBottom: "0.5rem" },
  title: { fontSize: "1.75rem", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.5px", marginBottom: "0.4rem" },
  subtitle: { fontSize: "0.9rem", color: "#8B8BA7" },
  errorBox: { background: "#1A0A0A", border: "1px solid #3A1A1A", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#EF4444", display: "flex", alignItems: "center", gap: "0.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label: { fontSize: "0.825rem", fontWeight: "500", color: "#A0A0B8", letterSpacing: "0.2px" },
  input: { padding: "0.8rem 1rem", background: "#111118", border: "1px solid #1E1E2E", borderRadius: "10px", fontSize: "0.95rem", color: "#FFFFFF", outline: "none", transition: "border-color 0.2s", width: "100%" },
  btn: { padding: "0.875rem", background: "linear-gradient(135deg, #06B6D4, #0891B2)", borderRadius: "10px", border: "none", color: "#FFFFFF", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", letterSpacing: "0.2px", boxShadow: "0 0 20px rgba(6,182,212,0.25)", marginTop: "0.25rem" },
  foot: { textAlign: "center", fontSize: "0.875rem", color: "#8B8BA7" },
  link: { color: "#06B6D4", fontWeight: "500", textDecoration: "none" },
};