import React from "react";
import { useState, useEffect } from "react";
import { jobsAPI } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function JobDetailPage() {
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.get(id).then(r => setJob(r.data)).catch(() => {});
  }, [id]);

  const handleApply = async () => {
    try {
      await jobsAPI.apply(id);
      setMessage("✅ Applied successfully! AI is ranking your profile...");
    } catch (err) {
      setMessage(err.response?.data?.detail || "❌ Application failed");
    }
  };

  if (!job) return <div style={{padding:"2rem"}}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>🎯 HireWise</h1>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
      </div>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2>{job.title}</h2>
          <p style={{color:"#666"}}>{job.location} • {job.experience_min}+ years experience</p>
          <hr />
          <h3>Job Description</h3>
          <p>{job.description}</p>
          {message && <p style={{color: message.includes("✅") ? "green" : "red"}}>{message}</p>}
          <button style={styles.applyBtn} onClick={handleApply}>
            ⚡ Apply with AI Ranking
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f4ff" },
  header: { background: "#4f46e5", color: "white", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { margin: 0, fontSize: "1.5rem" },
  backBtn: { padding: "0.4rem 1rem", borderRadius: "8px", background: "white", color: "#4f46e5", border: "none", cursor: "pointer" },
  content: { padding: "2rem", maxWidth: "800px", margin: "0 auto" },
  card: { background: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "1rem" },
  applyBtn: { padding: "0.75rem 2rem", borderRadius: "8px", background: "#10b981", color: "white", border: "none", fontSize: "1rem", cursor: "pointer", fontWeight: "bold", alignSelf: "flex-start" },
};