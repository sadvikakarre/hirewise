from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import auth, candidate, jobs

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Ensure upload directory exists
os.makedirs(settings.LOCAL_UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="HireWise API",
    description="AI-powered recruitment platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(candidate.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}
