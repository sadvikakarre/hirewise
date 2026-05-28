# HireWise — AI Recruitment Platform

> Spectrum Circle Hackathon | Problem Statement 3 | Full Stack + Agentic AI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Zustand |
| Backend | FastAPI (Python) + SQLAlchemy |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Database | PostgreSQL + Redis |
| File Storage | Local (dev) / AWS S3 (prod) |

## Project Structure

```
hirewise/
├── backend/
│   ├── app/
│   │   ├── api/routes/     # auth.py, candidate.py, jobs.py
│   │   ├── core/           # config, database, security
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # ai_service.py, resume_parser.py
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/     # recruiter/, candidate/, admin/, shared/
    │   ├── pages/          # All page components
    │   ├── services/       # api.js (Axios)
    │   └── store/          # authStore.js (Zustand)
    └── package.json
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY and DATABASE_URL

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### API Docs
Visit `http://localhost:8000/docs` for interactive Swagger UI.

## Key Features

- **Resume Parsing** — PDF/DOCX → structured data via Claude AI
- **Smart Ranking** — Claude scores candidate vs job description (0–100)
- **Explainable Decisions** — Select / Reject / Review with human-readable reasons
- **Role-based Access** — Recruiter, Candidate, Admin portals
- **JWT Auth** — Secure token-based authentication

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login → JWT token |
| POST | `/api/candidate/upload-resume` | Upload + AI parse resume |
| GET | `/api/candidate/profile` | Get parsed profile |
| GET | `/api/jobs` | List all active jobs |
| POST | `/api/jobs` | Create job (recruiter) |
| POST | `/api/jobs/{id}/apply` | Apply + instant AI ranking |
| GET | `/api/jobs/{id}/applications` | View ranked candidates (recruiter) |
