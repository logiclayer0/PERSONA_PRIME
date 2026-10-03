from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class BasicInfo(BaseModel):
    full_name: str
    education_stream: str
    education_level: str
    institution: str
    current_year: str
    city: Optional[str] = ""


class AnswerSubmission(BaseModel):
    question_id: str
    question_text: str
    answer: Any


class DiscoverySave(BaseModel):
    basic_info: Optional[BasicInfo] = None
    answers: Optional[List[AnswerSubmission]] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None


class DiscoveryResponse(BaseModel):
    id: int
    user_id: int
    full_name: Optional[str] = None
    education_stream: Optional[str] = None
    education_level: Optional[str] = None
    institution: Optional[str] = None
    current_year: Optional[str] = None
    city: Optional[str] = None
    interests: str = "[]"
    skills: str = "[]"
    answers: str = "{}"
    personality_type: str = "Unknown"
    confidence_score: float = 0.0
    roadmap: str = ""
    roadmap_generated: int = 0
    extra_notes: str = ""
    status: str = "in_progress"
    created_at: datetime

    class Config:
        from_attributes = True


class RoadmapRequest(BaseModel):
    extra_notes: Optional[str] = ""


class RoadmapResponse(BaseModel):
    roadmap: str
    personality_type: str
    confidence_score: float
    summary: str