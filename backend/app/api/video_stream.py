from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.pose_analyzer import PoseAnalyzer
from app.core.gesture_analyzer import GestureAnalyzer
from app.core.session_manager import session_manager_instance
import cv2
import numpy as np
import base64
import traceback

router = APIRouter()
# Defer optional computer-vision setup so an incompatible MediaPipe install
# cannot stop the main API (including authentication) from importing.
pose_analyzer = None
gesture_analyzer = None
session_manager = session_manager_instance


@router.websocket("/video/analyze")
async def video_analyze_stream(websocket: WebSocket):
    global pose_analyzer, gesture_analyzer
    await websocket.accept()
    session_uuid = None
    print("[WS] Video analyze client connected")
    try:
        if pose_analyzer is None:
            pose_analyzer = PoseAnalyzer()
        if gesture_analyzer is None:
            gesture_analyzer = GestureAnalyzer()
    except Exception as exc:
        print(f"[WS] Video analysis unavailable: {exc}")
        await websocket.send_json({"error": "Video analysis is temporarily unavailable. Please try again later."})
        await websocket.close(code=1011)
        return
    try:
        while True:
            data = await websocket.receive_text()

            if data.startswith("session:"):
                session_uuid = data.replace("session:", "").strip()
                print(f"[WS] Session bound: {session_uuid}")
                continue

            if data.startswith("data:image"):
                encoded = data.split(",")[1]
                nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                if frame is None:
                    continue

                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pose_result = pose_analyzer.analyze_frame(rgb)
                gesture_result = gesture_analyzer.analyze(rgb)

                combined = {
                    **pose_result,
                    "gesture": gesture_result.get("gesture", "idle"),
                    "gesture_status": gesture_result.get("status", "idle"),
                    "hand_count": gesture_result.get("hand_count", 0),
                    "nervous": gesture_result.get("nervous", False)
                }

                if session_uuid:
                    session_manager.add_vision_frame(session_uuid, pose_result)
                    session_manager.add_gesture_frame(session_uuid, gesture_result)

                try:
                    await websocket.send_json(combined)
                except Exception:
                    break

    except WebSocketDisconnect:
        print(f"[WS] Client disconnected. Session: {session_uuid}")
    except Exception as e:
        print(f"[WS] Unexpected error: {e}")
        traceback.print_exc()