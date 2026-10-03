from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.discovery import DiscoveryProfile
from app.schemas.discovery_schema import DiscoverySave, DiscoveryResponse, RoadmapRequest
from app.data.discovery_questions import BASIC_QUESTIONS, PERSONALITY_QUESTIONS
from app.api.auth import get_current_user
from app.services.roadmap_service import RoadmapService
import json
from datetime import datetime

router = APIRouter(prefix="/discovery", tags=["Discovery"])
roadmap_service = RoadmapService()


@router.get("/questions")
def get_questions():
    return {
        "basic": BASIC_QUESTIONS,
        "personality": PERSONALITY_QUESTIONS,
        "total": len(BASIC_QUESTIONS) + len(PERSONALITY_QUESTIONS)
    }


@router.get("/profile", response_model=DiscoveryResponse)
def get_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if not profile:
        profile = DiscoveryProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile


@router.post("/save", response_model=DiscoveryResponse)
def save_progress(payload: DiscoverySave, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if not profile:
        profile = DiscoveryProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    if payload.basic_info:
        profile.full_name = payload.basic_info.full_name
        profile.education_stream = payload.basic_info.education_stream
        profile.education_level = payload.basic_info.education_level
        profile.institution = payload.basic_info.institution
        profile.current_year = payload.basic_info.current_year
        profile.city = payload.basic_info.city

    if payload.answers is not None:
        existing = json.loads(profile.answers or "{}")
        for ans in payload.answers:
            existing[ans.question_id] = {
                "question": ans.question_text,
                "answer": ans.answer
            }
        profile.answers = json.dumps(existing)

    if payload.interests is not None:
        profile.interests = json.dumps(payload.interests)

    if payload.skills is not None:
        profile.skills = json.dumps(payload.skills)

    profile.status = "in_progress"
    profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(profile)

    return profile


@router.post("/complete", response_model=DiscoveryResponse)
def complete_discovery(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile.status = "completed"
    profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(profile)

    return profile


@router.post("/generate-roadmap")
def generate_roadmap(payload: RoadmapRequest = None, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    answers = json.loads(profile.answers or "{}")

    if len(answers) < 5:
        raise HTTPException(status_code=400, detail="Not enough answers. Complete the discovery first.")

    basic = {
        "full_name": profile.full_name or user.display_name,
        "education_stream": profile.education_stream,
        "education_level": profile.education_level,
        "institution": profile.institution,
        "current_year": profile.current_year,
        "city": profile.city
    }

    extra = ""
    if payload and payload.extra_notes:
        extra = f"\n\nEXTRA CONTEXT PROVIDED BY USER:\n{payload.extra_notes}"
        profile.extra_notes = payload.extra_notes

    result = roadmap_service.generate_roadmap(answers, basic)

    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])

    result["extra_notes"] = extra

    profile.roadmap = json.dumps(result)
    profile.roadmap_generated = 1
    profile.personality_type = result.get("personality_type", "Unknown")
    profile.confidence_score = result.get("confidence_score", 0.0)
    profile.status = "generated"
    profile.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(profile)

    return {
        "status": "success",
        "roadmap": result,
        "profile": {
            "full_name": profile.full_name,
            "personality_type": profile.personality_type,
            "confidence_score": profile.confidence_score
        }
    }


@router.get("/roadmap")
def get_roadmap(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if not profile.roadmap or not profile.roadmap_generated:
        raise HTTPException(status_code=404, detail="Roadmap not generated yet")

    return {
        "roadmap": json.loads(profile.roadmap),
        "profile": {
            "full_name": profile.full_name,
            "personality_type": profile.personality_type,
            "confidence_score": profile.confidence_score,
            "extra_notes": profile.extra_notes
        }
    }


@router.delete("/reset")
def reset_discovery(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if profile:
        db.delete(profile)
        db.commit()

    return {"status": "reset"}
