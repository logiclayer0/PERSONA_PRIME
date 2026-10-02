from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.core.audio_analyzer import AudioAnalyzer
from app.core.session_manager import session_manager_instance
import shutil
import os

router = APIRouter(prefix="/audio", tags=["Audio"])
analyzer = AudioAnalyzer()
session_manager = session_manager_instance


@router.post("/analyze-file")
async def analyze_speech_audio(
    file: UploadFile = File(...),
    session_uuid: str = Form(None)
):
    if not session_uuid:
        raise HTTPException(status_code=400, detail="session_uuid required")

    temp_dir = "temp_audio"
    os.makedirs(temp_dir, exist_ok=True)
    path = os.path.join(temp_dir, f"{session_uuid}.wav")

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyzer.transcribe_and_analyze(path)

    if os.path.exists(path):
        os.remove(path)

    session_manager.add_audio_result(session_uuid, result)

    return {
        "status": "processed",
        "session_uuid": session_uuid,
        "audio_analysis": result
    }