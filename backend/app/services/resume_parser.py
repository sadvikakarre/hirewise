import fitz  # PyMuPDF
import docx
import os
from pathlib import Path
from app.core.config import settings


def extract_text_from_pdf(file_path: str) -> str:
    """Extract plain text from a PDF resume."""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


def extract_text_from_docx(file_path: str) -> str:
    """Extract plain text from a DOCX resume."""
    doc = docx.Document(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def extract_resume_text(file_path: str) -> str:
    """Auto-detect file type and extract text."""
    ext = Path(file_path).suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in (".docx", ".doc"):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def save_upload(file_bytes: bytes, filename: str, user_id: int) -> str:
    """Save uploaded resume to local storage, return relative path."""
    upload_dir = Path(settings.LOCAL_UPLOAD_DIR) / str(user_id)
    upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"resume_{user_id}_{filename}"
    file_path = upload_dir / safe_name
    with open(file_path, "wb") as f:
        f.write(file_bytes)
    return str(file_path)
