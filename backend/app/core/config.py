from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "HireWise"
    SECRET_KEY: str = "changeme"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/hirewise"
    REDIS_URL: str = "redis://localhost:6379"

    ANTHROPIC_API_KEY: str = ""

    STORAGE_TYPE: str = "local"
    LOCAL_UPLOAD_DIR: str = "./uploads"
    S3_BUCKET_NAME: Optional[str] = None

    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
