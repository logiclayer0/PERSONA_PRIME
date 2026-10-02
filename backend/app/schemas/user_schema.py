from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    display_name: str
    password: str
    role: str = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    display_name: str
    role: str
    language: str
    theme: str
    points: int
    streak: int
    total_sessions: int
    reminders_enabled: bool
    reminder_time: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class ThemeUpdate(BaseModel):
    theme: str


class ReminderUpdate(BaseModel):
    reminders_enabled: bool
    reminder_time: str


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    language: Optional[str] = None