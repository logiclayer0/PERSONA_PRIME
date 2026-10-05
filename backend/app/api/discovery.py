from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.discovery import DiscoveryProfile
from app.schemas.discovery_schema import DiscoverySave, DiscoveryResponse, RoadmapRequest
from app.data.discovery_questions import get_questions_for_user
from app.api.auth import get_current_user
from app.services.roadmap_service import RoadmapService
import json
import io
from datetime import datetime

router = APIRouter(prefix="/discovery", tags=["Discovery"])
roadmap_service = RoadmapService()


@router.get("/questions")
def get_questions(stream: str = None, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not stream and user:
        profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
        if profile and profile.education_stream:
            stream = profile.education_stream

    return get_questions_for_user(stream)


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

    interests = json.loads(profile.interests or "[]")
    skills = json.loads(profile.skills or "[]")

    basic["interests"] = interests
    basic["skills"] = skills

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


@router.get("/export-pdf")
def export_pdf(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if not profile or not profile.roadmap_generated:
        raise HTTPException(status_code=404, detail="No roadmap to export")

    roadmap = json.loads(profile.roadmap)

    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    except ImportError:
        raise HTTPException(status_code=500, detail="PDF library not installed. Run: pip install reportlab")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=50, bottomMargin=50)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#a855f7'), spaceAfter=20)
    h2_style = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=16, textColor=colors.HexColor('#8b5cf6'), spaceAfter=12, spaceBefore=16)
    body_style = ParagraphStyle('Body', parent=styles['BodyText'], fontSize=10, leading=14, spaceAfter=8)
    bullet_style = ParagraphStyle('Bullet', parent=styles['BodyText'], fontSize=10, leading=14, leftIndent=20, spaceAfter=4)

    story = []
    story.append(Paragraph("Persona Prime — Blueprint", title_style))
    story.append(Paragraph(f"<b>{profile.full_name or user.display_name}</b>", h2_style))
    story.append(Paragraph(f"Personality: {roadmap.get('personality_type', 'N/A')}", body_style))
    story.append(Paragraph(f"Confidence Score: {roadmap.get('confidence_score', 0)}%", body_style))
    story.append(Spacer(1, 20))

    story.append(Paragraph("Summary", h2_style))
    story.append(Paragraph(roadmap.get('summary', ''), body_style))

    story.append(Paragraph("Personality Analysis", h2_style))
    story.append(Paragraph(roadmap.get('personality_analysis', ''), body_style))

    story.append(Paragraph("Strengths", h2_style))
    for s in roadmap.get('strengths', []):
        story.append(Paragraph(f"• {s}", bullet_style))

    story.append(Paragraph("Weaknesses", h2_style))
    for w in roadmap.get('weaknesses', []):
        story.append(Paragraph(f"• {w}", bullet_style))

    story.append(PageBreak())

    story.append(Paragraph("Career Recommendations", h2_style))
    for c in roadmap.get('career_fields', []):
        story.append(Paragraph(f"<b>{c.get('field')}</b> — {c.get('match')}% match", body_style))
        story.append(Paragraph(f"{c.get('why', '')}", bullet_style))
        story.append(Paragraph(f"Salary: {c.get('salary_range', 'N/A')} | Growth: {c.get('growth', 'N/A')} | Difficulty: {c.get('difficulty', 'N/A')}", bullet_style))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    story.append(Paragraph("5-Year Roadmap", h2_style))
    for y in roadmap.get('roadmap_5_year', []):
        story.append(Paragraph(f"<b>{y.get('year')}: {y.get('theme')}</b>", body_style))
        story.append(Paragraph("Goals:", bullet_style))
        for g in y.get('goals', []):
            story.append(Paragraph(f"  • {g}", bullet_style))
        story.append(Paragraph("Skills:", bullet_style))
        for sk in y.get('skills', []):
            story.append(Paragraph(f"  • {sk}", bullet_style))
        if y.get('weekly_plan'):
            story.append(Paragraph(f"Weekly: {y.get('weekly_plan')}", bullet_style))
        story.append(Spacer(1, 10))

    story.append(PageBreak())

    story.append(Paragraph("Resources", h2_style))
    story.append(Paragraph("<b>Books:</b>", body_style))
    for b in roadmap.get('resources', {}).get('books', []):
        story.append(Paragraph(f"• <b>{b.get('title')}</b> by {b.get('author')} — {b.get('why', '')}", bullet_style))

    story.append(Paragraph("<b>YouTube Channels:</b>", body_style))
    for yt in roadmap.get('resources', {}).get('youtube_channels', []):
        story.append(Paragraph(f"• {yt.get('name')} — {yt.get('topic', '')}", bullet_style))

    story.append(Paragraph("<b>Online Courses:</b>", body_style))
    for c in roadmap.get('resources', {}).get('online_courses', []):
        story.append(Paragraph(f"• {c.get('course')} on {c.get('platform')} — {c.get('why', '')}", bullet_style))

    story.append(PageBreak())

    story.append(Paragraph("Brutal Honesty", h2_style))
    story.append(Paragraph(roadmap.get('brutal_honesty', ''), body_style))

    story.append(Paragraph("Pros", h2_style))
    for p in roadmap.get('pros', []):
        story.append(Paragraph(f"• {p}", bullet_style))

    story.append(Paragraph("Cons", h2_style))
    for c in roadmap.get('cons', []):
        story.append(Paragraph(f"• {c}", bullet_style))

    story.append(Paragraph("Immediate Actions", h2_style))
    for a in roadmap.get('immediate_actions', []):
        if isinstance(a, dict):
            story.append(Paragraph(f"• {a.get('action')} ({a.get('deadline', '')})", bullet_style))
        else:
            story.append(Paragraph(f"• {a}", bullet_style))

    story.append(Paragraph("Common Mistakes to Avoid", h2_style))
    for m in roadmap.get('common_mistakes', []):
        story.append(Paragraph(f"• {m}", bullet_style))

    story.append(Paragraph("Mentor Advice", h2_style))
    story.append(Paragraph(roadmap.get('mentor_advice', ''), body_style))

    story.append(Paragraph("Financial Planning", h2_style))
    story.append(Paragraph(roadmap.get('financial_planning', ''), body_style))

    story.append(Paragraph("Backup Plan", h2_style))
    story.append(Paragraph(roadmap.get('backup_plan', ''), body_style))

    story.append(Paragraph("Interview Prep Tips", h2_style))
    for i in roadmap.get('interview_prep', []):
        story.append(Paragraph(f"• {i}", bullet_style))

    story.append(Paragraph("Daily Habits", h2_style))
    for h in roadmap.get('daily_habits', []):
        story.append(Paragraph(f"• {h}", bullet_style))

    doc.build(story)
    buffer.seek(0)

    filename = f"persona_prime_blueprint_{user.id}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.delete("/reset")
def reset_discovery(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = db.query(DiscoveryProfile).filter(DiscoveryProfile.user_id == user.id).first()
    if profile:
        db.delete(profile)
        db.commit()

    return {"status": "reset"}
