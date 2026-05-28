import React from "react";
import { useState, useEffect } from "react";
import { jobsAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.list().then(r => setJobs(r.data)).catch(() => {});
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>🎯 HireWise</h1>
        <button style={styles.backBtn} onClick={() => navigate("/candidate")}>← Back</button>
      </div>
      <div style={styles.content}>
        <h2>💼 All Available Jobs</h2>
        {jobs.length === 0 && <p style={{color:"#666"}}>No jobs available yet</p>}
        {jobs.map(job => (
          <div key={job.id} style={styles.jobCard}>
            <h3 style={{margin:"0 0 0.25rem"}}>{job.title}</h3>
            <p style={{color:"#666", margin:"0 0 0.5rem"}}>{job.location} • {job.experience_min}+ years</p>
            <p style={{margin:"0 0 1rem"}}>{job.description.slice(0, 150)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f4ff" },
  header: { background: "#4f46e5", color: "white", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { margin: 0, fontSize: "1.5rem" },
  backBtn: { padding: "0.4rem 1rem", borderRadius: "8px", background: "white", color: "#4f46e5", border: "none", cursor: "pointer" },
  content: { padding: "2rem", maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" },
  jobCard: { background: "white", border: "1px solid #eee", borderRadius: "12px", padding: "1.5rem" },
};