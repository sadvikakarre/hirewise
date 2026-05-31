import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

FEATHERLESS_API_KEY = "rc_90334bb3ab0e5ce73ab595b7eb69e7389447d7a84475a5ab16b0da6ad686dc58"
FEATHERLESS_URL = "https://api.featherless.ai/v1/chat/completions"
MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
headers = {
    "Authorization": f"Bearer {FEATHERLESS_API_KEY}",
    "Content-Type": "application/json"
}


def call_ai(prompt: str) -> str:
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000
    }
    response = requests.post(FEATHERLESS_URL, json=payload, headers=headers)
    data = response.json()
    print("Featherless response:", data)
    if "choices" in data:
        return data["choices"][0]["message"]["content"].strip()
    return "{}"


def extract_json(text: str) -> dict:
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group())
    return {}


def parse_resume_with_ai(resume_text: str) -> dict:
    msg = "Parse this resume and return ONLY a JSON object with: skills (list), experience_years (number), education (string), certifications (list), summary (string). Resume: " + resume_text[:2000]
    raw = call_ai(msg)
    try:
        return extract_json(raw)
    except:
        return {"skills": [], "experience_years": 0, "education": "", "certifications": [], "summary": ""}


def rank_candidate(resume_text: str, job_description: str, candidate_skills: list, experience_years: float) -> dict:
    skills_str = ", ".join(candidate_skills) if candidate_skills else "Not specified"
    msg = "Evaluate candidate for job. Return ONLY a JSON object with: match_score (0-100), status (select/review/reject), reasoning (string), strengths (list), weaknesses (list), skill_match (object with matched and missing lists). Job: " + job_description[:400] + " Skills: " + skills_str + " Years: " + str(experience_years) + " Resume: " + resume_text[:400]
    raw = call_ai(msg)
    try:
        return extract_json(raw)
    except:
        return {"match_score": 50, "status": "review", "reasoning": "Could not evaluate", "strengths": [], "weaknesses": [], "skill_match": {"matched": [], "missing": []}}