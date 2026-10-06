from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.session import PracticeSession
from app.models.user import User
from app.schemas.session_schema import SessionCreate
from app.core.session_manager import session_manager_instance
from app.core.streak_manager import StreakManager
from app.core.grammar_analyzer import GrammarAnalyzer
from app.services.llm_service import LLMService
from app.api.auth import get_current_user
from datetime import datetime
import uuid
import json

router = APIRouter(prefix="/analytics", tags=["Analytics"])
session_manager = session_manager_instance
streak_manager = StreakManager()
grammar_analyzer = GrammarAnalyzer()
llm = LLMService()


@router.post("/start")
def start_session(payload: SessionCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail='Not authenticated')

    session_uuid = str(uuid.uuid4())
    new_session = PracticeSession(
        session_uuid=session_uuid,
        user_id=user.id,
        tutor_id=payload.tutor_id,
        category=payload.category,
        content_mode=payload.content_mode,
        duration_minutes=payload.duration_minutes,
        script_text=payload.script_text or ""
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    session_manager.create_session(session_uuid, payload.tutor_id, payload.category)

    return {"session_uuid": session_uuid, "data": new_session}


@router.post("/end/{session_uuid}")
def end_session(session_uuid: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail='Not authenticated')

    summary = session_manager.get_summary(session_uuid)

    if not user:
        raise HTTPException(status_code=401, detail='Not authenticated')

    session = db.query(PracticeSession).filter(
        PracticeSession.session_uuid == session_uuid
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found in DB")

    if not summary:
        session.final_status = "NO DATA"
        session.ai_feedback = "No data was captured this session. Next time, keep the camera on and speak for at least 30 seconds."
        db.commit()
        db.refresh(session)
        return {
            "session": {"session_uuid": session.session_uuid, "final_status": "NO DATA"},
            "breakdown": None,
            "user": {"streak": 0, "points": 0, "total_sessions": 0}
        }

    transcript = summary.get("transcript", "")
    grammar_result = grammar_analyzer.analyze(transcript)
    session_manager.add_grammar_result(session_uuid, grammar_result)

    summary = session_manager.get_summary(session_uuid)

    confidence = summary["confidence_score"]
    final_status = summary["final_status"]

    feedback = ""
    try:
        feedback = llm.generate_feedback(transcript or "No speech detected", summary)
    except Exception:
        feedback = "Coach is busy right now — but you showed up. That's what matters."

    points = streak_manager.calculate_points(final_status, confidence)

    db_user = db.query(User).filter(User.id == user.id).first()
    if user:
        user.streak = streak_manager.update_streak(user.last_practice_date, user.streak)
        user.last_practice_date = datetime.utcnow()
        user.points += points
        user.total_sessions += 1

    session.posture_status = summary["posture_status"]
    session.eye_contact_status = summary["eye_contact_status"]
    session.gesture_status = summary["gesture_status"]
    session.speech_status = summary["speech_status"]
    session.grammar_status = summary["grammar_status"]
    session.final_status = final_status
    session.confidence_score = confidence
    session.points_earned = points
    session.transcript = transcript
    session.ai_feedback = feedback

    live = session_manager.get_session(session_uuid)
    events = live.get("events", []) if live else []
    session.events = json.dumps(events)

    db.commit()
    db.refresh(session)
    db.refresh(db_user)

    return {
        "session": {
            "session_uuid": session.session_uuid,
            "final_status": session.final_status,
            "posture_status": session.posture_status,
            "eye_contact_status": session.eye_contact_status,
            "gesture_status": session.gesture_status,
            "speech_status": session.speech_status,
            "grammar_status": session.grammar_status,
            "confidence_score": session.confidence_score,
            "points_earned": session.points_earned,
            "ai_feedback": session.ai_feedback,
            "transcript": session.transcript
        },
        "breakdown": summary,
        "user": {
            "streak": user.streak,
            "points": user.points,
            "total_sessions": user.total_sessions
        }
    }


@router.get("/report/{session_uuid}")
def get_report(session_uuid: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(PracticeSession).filter(
        PracticeSession.session_uuid == session_uuid
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    summary = session_manager.get_summary(session_uuid)

    return {
        "session_uuid": session.session_uuid,
        "category": session.category,
        "tutor_id": session.tutor_id,
        "final_status": session.final_status,
        "posture_status": session.posture_status,
        "speech_status": session.speech_status,
        "eye_contact_status": session.eye_contact_status,
        "gesture_status": session.gesture_status,
        "grammar_status": session.grammar_status,
        "confidence_score": session.confidence_score,
        "points_earned": session.points_earned,
        "ai_feedback": session.ai_feedback,
        "transcript": session.transcript,
        "events": json.loads(session.events or "[]"),
        "posture_pct": summary.get("posture_pct", 0) if summary else 0,
        "eye_pct": summary.get("eye_pct", 0) if summary else 0,
        "gesture_pct": summary.get("gesture_pct", 0) if summary else 0,
        "speech_pct": summary.get("speech_pct", 0) if summary else 0,
        "grammar_pct": summary.get("grammar_pct", 0) if summary else 0,
        "wpm": summary.get("wpm", 0) if summary else 0,
        "fillers": summary.get("fillers", 0) if summary else 0,
        "pace": summary.get("pace", "Unknown") if summary else "Unknown",
        "grammar_issues": summary.get("grammar_issues", []) if summary else [],
        "grammar_feedback": summary.get("grammar_feedback", "") if summary else "",
        "dominant_gesture": summary.get("dominant_gesture", "none") if summary else "none",
        "gesture_variety": summary.get("gesture_variety", 0) if summary else 0,
        "nervous_signals": summary.get("nervous_signals", 0) if summary else 0,
        "created_at": session.created_at.isoformat() if session.created_at else None
    }