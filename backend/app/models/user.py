from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student")
    language = Column(String, default="English")
    theme = Column(String, default="dark")
    points = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    total_sessions = Column(Integer, default=0)
    reminders_enabled = Column(Boolean, default=True)
    reminder_time = Column(String, default="19:00")
    last_practice_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)