from pydantic import BaseModel
from typing import Optional, List


class SessionCreate(BaseModel):
    tutor_id: str
    category: str
    content_mode: str
    duration_minutes: int
    script_text: Optional[str] = ""


class SessionResponse(BaseModel):
    session_uuid: str
    tutor_id: str
    category: str
    content_mode: str
    duration_minutes: int
    final_status: str

    class Config:
        from_attributes = True


class VisionUpdate(BaseModel):
    session_uuid: str
    posture: str
    eye_contact: str
    gesture: str
    events: List[dict] = []