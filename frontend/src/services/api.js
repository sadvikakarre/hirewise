import axios from "axios";

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://hirewise-production-1070.up.railway.app/api",});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// ── Candidate ─────────────────────────────────────────
export const candidateAPI = {
  uploadResume: (file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/candidate/upload-resume", form);
  },
  getProfile: () => api.get("/candidate/profile"),
  updateProfile: (data) => api.patch("/candidate/profile", data),
};

// ── Jobs ──────────────────────────────────────────────
export const jobsAPI = {
  list: () => api.get("/jobs"),
  get: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post("/jobs", data),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  getApplications: (id) => api.get(`/jobs/${id}/applications`),
};

export default api;
