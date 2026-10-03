from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float
from datetime import datetime
from app.database import Base


class DiscoveryProfile(Base):
    __tablename__ = "discovery_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name = Column(String)
    education_stream = Column(String)
    education_level = Column(String)
    institution = Column(String)
    current_year = Column(String)
    city = Column(String)
    interests = Column(Text, default="[]")
    skills = Column(Text, default="[]")
    answers = Column(Text, default="{}")
    personality_type = Column(String, default="Unknown")
    confidence_score = Column(Float, default=0.0)
    roadmap = Column(Text, default="")
    roadmap_generated = Column(Integer, default=0)
    extra_notes = Column(Text, default="")
    status = Column(String, default="in_progress")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
