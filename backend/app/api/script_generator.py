from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import LLMService

router = APIRouter(prefix="/script", tags=["Script Generator"])
llm = LLMService()


class ScriptRequest(BaseModel):
    category: str
    topic: str
    duration_minutes: int
    language: str = "English"
    role: str = "student"


@router.post("/generate")
def generate_script(payload: ScriptRequest):
    try:
        script = llm.generate_script(
            category=payload.category,
            topic=payload.topic,
            duration_minutes=payload.duration_minutes,
            language=payload.language,
            role=payload.role
        )
        return {"status": "success", "script": script}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))