from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.llm_service import TUTOR_PROMPTS
from groq import Groq
from app.config import get_settings

router = APIRouter(prefix="/avatar", tags=["Avatar"])
settings = get_settings()
groq_client = Groq(api_key=settings.GROQ_API_KEY)


class ChatMessage(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    tutor_id: str
    message: str
    history: Optional[List[ChatMessage]] = []


class ContextCommentRequest(BaseModel):
    tutor_id: str
    trigger: Optional[str] = "auto"
    vision: Optional[dict] = None
    audio: Optional[dict] = None
    elapsed_seconds: int = 0
    last_comment: Optional[str] = ""
    page: Optional[str] = "general"
    action: Optional[str] = ""


@router.post("/chat")
def avatar_chat(payload: ChatRequest):
    persona = TUTOR_PROMPTS.get(payload.tutor_id, TUTOR_PROMPTS["seraphina"])
    messages = [{
        "role": "system",
        "content": persona + "\n\nKeep replies SHORT (1-2 sentences). Stay in character. Help the user with public speaking or confidence."
    }]
    for h in payload.history[-6:]:
        messages.append({"role": "user" if h.role == "user" else "assistant", "content": h.text})
    messages.append({"role": "user", "content": payload.message})

    try:
        completion = groq_client.chat.completions.create(
            messages=messages,
            model="openai/gpt-oss-120b",
            temperature=0.85,
            max_tokens=150
        )
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/comment")
def avatar_comment(payload: ContextCommentRequest):
    persona = TUTOR_PROMPTS.get(payload.tutor_id, TUTOR_PROMPTS["seraphina"])

    vision = payload.vision or {}
    audio = payload.audio or {}

    context_lines = [f"Page: {payload.page}"]
    context_lines.append(f"Trigger: {payload.trigger}")
    if payload.action:
        context_lines.append(f"Action: {payload.action}")

    if vision:
        context_lines.append(f"Posture: {vision.get('posture', 'Unknown')}")
        context_lines.append(f"Eye: {vision.get('eye_contact', 'Unknown')}")

    if audio:
        context_lines.append(f"Speech: {audio.get('speech_performance', 'No data')}")
        context_lines.append(f"WPM: {audio.get('wpm', 0)}")
        context_lines.append(f"Fillers: {audio.get('total_fillers_detected', 0)}")

    context = "\n".join(context_lines)

    prompt = f"""You are this character:
{persona}

React to the user's app activity with ONE short line — MAXIMUM 8 WORDS.

Context:
{context}

Last thing you said: "{payload.last_comment}"

Rules:
- ABSOLUTE MAX 8 WORDS.
- Punchy, funny, motivating.
- Match your personality exactly.
- React to the specific action shown above.
- Never repeat the last comment.
- ONLY output the line. No quotes. No name. No emojis unless natural.

Examples of good length:
- "Ooh, nice choice!"
- "Focus. Move faster."
- "WOO! Let's gooo!"

Now output your line:"""

    try:
        completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-120b",
            temperature=0.95,
            max_tokens=30
        )
        comment = completion.choices[0].message.content.strip().strip('"').strip("'")

        words = comment.split()
        if len(words) > 10:
            comment = " ".join(words[:8])

        return {"comment": comment}
    except Exception:
        fallback = {
            "seraphina": "You're doing wonderfully.",
            "vladimir": "Focus. Straighten up.",
            "aurora": "WOO! You've got this!"
        }
        return {"comment": fallback.get(payload.tutor_id, "Keep going.")}