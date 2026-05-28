from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.user import UserRole, DecisionStatus


# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.candidate


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: int
    name: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


# ── Candidate ─────────────────────────────────────────
class CandidateProfileOut(BaseModel):
    id: int
    user_id: int
    resume_url: Optional[str]
    skills: Optional[str]
    experience_years: Optional[float]
    education: Optional[str]
    certifications: Optional[str]
    github_url: Optional[str]
    linkedin_url: Optional[str]
    parsed_at: Optional[datetime]

    class Config:
        from_attributes = True


class CandidateUpdate(BaseModel):
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None


# ── Job ───────────────────────────────────────────────
class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: Optional[str] = None
    experience_min: float = 0
    location: Optional[str] = None


class JobOut(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    required_skills: Optional[str]
    experience_min: float
    location: Optional[str]
    is_active: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Application ───────────────────────────────────────
class ApplicationOut(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    match_score: Optional[float]
    status: DecisionStatus
    ai_reasoning: Optional[str]
    skill_match: Optional[str]
    strengths: Optional[str]
    weaknesses: Optional[str]
    applied_at: datetime

    class Config:
        from_attributes = True


class ApplicationWithCandidate(ApplicationOut):
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
