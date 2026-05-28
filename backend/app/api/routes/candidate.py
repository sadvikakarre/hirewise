import json
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, CandidateProfile
from app.schemas.schemas import CandidateProfileOut, CandidateUpdate
from app.services.resume_parser import save_upload, extract_resume_text
from app.services.ai_service import parse_resume_with_ai

router = APIRouter(prefix="/candidate", tags=["candidate"])


@router.post("/upload-resume", response_model=CandidateProfileOut)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ("application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    contents = await file.read()
    file_path = save_upload(contents, file.filename, current_user.id)

    # Extract raw text
    raw_text = extract_resume_text(file_path)

    # Parse with AI
    parsed = parse_resume_with_ai(raw_text)

    # Upsert candidate profile
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)

    profile.resume_url = file_path
    profile.raw_text = raw_text
    profile.skills = json.dumps(parsed.get("skills", []))
    profile.experience_years = parsed.get("experience_years", 0)
    profile.education = parsed.get("education", "")
    profile.certifications = json.dumps(parsed.get("certifications", []))
    profile.parsed_at = datetime.utcnow()

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/profile", response_model=CandidateProfileOut)
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please upload your resume first.")
    return profile


@router.patch("/profile", response_model=CandidateProfileOut)
def update_profile(
    payload: CandidateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    for field, val in payload.dict(exclude_none=True).items():
        setattr(profile, field, val)
    db.commit()
    db.refresh(profile)
    return profile
