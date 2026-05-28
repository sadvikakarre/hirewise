from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    recruiter = "recruiter"
    candidate = "candidate"
    admin = "admin"


class DecisionStatus(str, enum.Enum):
    select = "select"
    reject = "reject"
    review = "review"
    pending = "pending"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.candidate)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)
    job_postings = relationship("JobPosting", back_populates="recruiter")


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    resume_url = Column(String, nullable=True)
    raw_text = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)          # JSON string
    experience_years = Column(Float, nullable=True)
    education = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)  # JSON string
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    parsed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="candidate_profile")
    applications = relationship("Application", back_populates="candidate")


class JobPosting(Base):
    __tablename__ = "job_postings"
    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=True)   # JSON string
    experience_min = Column(Float, default=0)
    location = Column(String(100), nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    recruiter = relationship("User", back_populates="job_postings")
    applications = relationship("Application", back_populates="job")


class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    job_id = Column(Integer, ForeignKey("job_postings.id"))
    match_score = Column(Float, nullable=True)
    status = Column(Enum(DecisionStatus), default=DecisionStatus.pending)
    ai_reasoning = Column(Text, nullable=True)
    skill_match = Column(Text, nullable=True)       # JSON string
    strengths = Column(Text, nullable=True)         # JSON string
    weaknesses = Column(Text, nullable=True)        # JSON string
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    candidate = relationship("CandidateProfile", back_populates="applications")
    job = relationship("JobPosting", back_populates="applications")
