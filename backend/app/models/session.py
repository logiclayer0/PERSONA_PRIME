from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
from datetime import datetime
from app.database import Base


class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_uuid = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tutor_id = Column(String)
    category = Column(String)
    content_mode = Column(String)
    duration_minutes = Column(Integer)
    script_text = Column(Text)
    video_path = Column(String, nullable=True)
    final_status = Column(String, default="PENDING")
    posture_status = Column(String, default="PENDING")
    speech_status = Column(String, default="PENDING")
    eye_contact_status = Column(String, default="PENDING")
    gesture_status = Column(String, default="PENDING")
    grammar_status = Column(String, default="PENDING")
    confidence_score = Column(Float, default=0.0)
    points_earned = Column(Integer, default=0)
    events = Column(Text, default="[]")
    timeline = Column(Text, default="[]")
    transcript = Column(Text, default="")
    ai_feedback = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)