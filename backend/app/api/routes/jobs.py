import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, JobPosting, Application, CandidateProfile, UserRole
from app.schemas.schemas import JobCreate, JobOut, ApplicationOut, ApplicationWithCandidate
from app.services.ai_service import rank_candidate

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/", response_model=JobOut, status_code=201)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in (UserRole.recruiter, UserRole.admin):
        raise HTTPException(status_code=403, detail="Only recruiters can post jobs")
    job = JobPosting(**payload.dict(), recruiter_id=current_user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/", response_model=List[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(JobPosting).filter(JobPosting.is_active == 1).all()


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/{job_id}/apply", response_model=ApplicationOut)
def apply_to_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile or not profile.raw_text:
        raise HTTPException(status_code=400, detail="Please upload your resume before applying")

    # Check duplicate application
    existing = db.query(Application).filter(
        Application.candidate_id == profile.id,
        Application.job_id == job_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Already applied to this job")

    # AI ranking
    skills = json.loads(profile.skills) if profile.skills else []
    result = rank_candidate(
        resume_text=profile.raw_text,
        job_description=job.description,
        candidate_skills=skills,
        experience_years=profile.experience_years or 0,
    )

    app = Application(
        candidate_id=profile.id,
        job_id=job_id,
        match_score=result.get("match_score"),
        status=result.get("status", "pending"),
        ai_reasoning=result.get("reasoning"),
        strengths=json.dumps(result.get("strengths", [])),
        weaknesses=json.dumps(result.get("weaknesses", [])),
        skill_match=json.dumps(result.get("skill_match", {})),
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.get("/{job_id}/applications", response_model=List[ApplicationWithCandidate])
def get_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in (UserRole.recruiter, UserRole.admin):
        raise HTTPException(status_code=403, detail="Access denied")

    apps = db.query(Application).filter(Application.job_id == job_id)\
        .order_by(Application.match_score.desc()).all()

    result = []
    for a in apps:
        item = ApplicationWithCandidate.from_orm(a)
        if a.candidate and a.candidate.user:
            item.candidate_name = a.candidate.user.name
            item.candidate_email = a.candidate.user.email
        result.append(item)
    return result
