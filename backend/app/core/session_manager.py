from datetime import datetime


class SessionManager:
    def __init__(self):
        self.sessions = {}

    def create_session(self, session_uuid: str, tutor_id: str, category: str):
        self.sessions[session_uuid] = {
            "session_uuid": session_uuid,
            "tutor_id": tutor_id,
            "category": category,
            "started_at": datetime.utcnow().isoformat(),
            "posture_good": 0,
            "posture_bad": 0,
            "posture_none": 0,
            "eye_good": 0,
            "eye_poor": 0,
            "gesture_active": 0,
            "gesture_idle": 0,
            "gesture_nervous": 0,
            "gesture_history": [],
            "events": [],
            "audio_result": None,
            "audio_done": False,
            "grammar_result": None
        }
        return self.sessions[session_uuid]

    def add_vision_frame(self, session_uuid: str, vision_result: dict):
        s = self.sessions.get(session_uuid)
        if not s:
            return None

        posture = vision_result.get("posture", "")
        eye = vision_result.get("eye_contact", "")

        if "Bad" in posture:
            s["posture_bad"] += 1
        elif "No Person" in posture:
            s["posture_none"] += 1
        else:
            s["posture_good"] += 1

        if eye == "Poor":
            s["eye_poor"] += 1
        else:
            s["eye_good"] += 1

        return s

    def add_gesture_frame(self, session_uuid: str, gesture_result: dict):
        s = self.sessions.get(session_uuid)
        if not s:
            return None

        status = gesture_result.get("status", "idle")
        gesture = gesture_result.get("gesture", "idle")
        nervous = gesture_result.get("nervous", False)

        if status == "active":
            s["gesture_active"] += 1
        else:
            s["gesture_idle"] += 1

        if nervous:
            s["gesture_nervous"] += 1

        s["gesture_history"].append(gesture)
        if len(s["gesture_history"]) > 60:
            s["gesture_history"].pop(0)

        return s

    def add_audio_result(self, session_uuid: str, audio_result: dict):
        s = self.sessions.get(session_uuid)
        if not s:
            return None
        s["audio_result"] = audio_result
        s["audio_done"] = True
        return s

    def add_grammar_result(self, session_uuid: str, grammar_result: dict):
        s = self.sessions.get(session_uuid)
        if not s:
            return None
        s["grammar_result"] = grammar_result
        return s

    def get_summary(self, session_uuid: str):
        s = self.sessions.get(session_uuid)
        if not s:
            return None

        total_p = s["posture_good"] + s["posture_bad"] + s["posture_none"]
        total_e = s["eye_good"] + s["eye_poor"]
        total_g = s["gesture_active"] + s["gesture_idle"]

        def pct(good, total):
            if total == 0:
                return 0
            return round((good / total) * 100, 1)

        posture_pct = pct(s["posture_good"], total_p)
        eye_pct = pct(s["eye_good"], total_e)
        gesture_pct = pct(s["gesture_active"], total_g)

        audio = s.get("audio_result") or {}
        speech_pct = 0
        wpm = 0
        fillers = 0
        pace = "Unknown"
        transcript = ""

        if audio:
            perf = audio.get("speech_performance", "")
            if "Excellent" in perf:
                speech_pct = 95
            elif "Good" in perf:
                speech_pct = 75
            elif "Warning" in perf:
                speech_pct = 45
            wpm = audio.get("wpm", 0)
            fillers = audio.get("total_fillers_detected", 0)
            pace = audio.get("pace_status", "Unknown")
            transcript = audio.get("transcript", "")

        grammar = s.get("grammar_result") or {}
        grammar_pct = grammar.get("grammar_score", 0)
        grammar_status_val = grammar.get("status", "PENDING")

        MIN_FRAMES = 5

        if total_p >= MIN_FRAMES:
            posture_status = "PASSED" if posture_pct >= 60 else "FAILED"
        else:
            posture_status = "NO DATA"
            posture_pct = 0

        if total_e >= MIN_FRAMES:
            eye_status = "PASSED" if eye_pct >= 60 else "FAILED"
        else:
            eye_status = "NO DATA"
            eye_pct = 0

        if total_g >= MIN_FRAMES:
            gesture_status = "PASSED" if gesture_pct >= 40 else "FAILED"
        else:
            gesture_status = "NO DATA"
            gesture_pct = 0

        if audio and audio.get("transcript"):
            speech_status = "PASSED" if speech_pct >= 60 else "FAILED"
        else:
            speech_status = "NO DATA"

        available_metrics = []
        if total_p >= MIN_FRAMES:
            available_metrics.append(posture_pct)
        if total_e >= MIN_FRAMES:
            available_metrics.append(eye_pct)
        if total_g >= MIN_FRAMES:
            available_metrics.append(gesture_pct)
        if audio and audio.get("transcript"):
            available_metrics.append(speech_pct)
        if grammar_pct > 0:
            available_metrics.append(grammar_pct)

        confidence = round(sum(available_metrics) / len(available_metrics), 1) if available_metrics else 0

        statuses = [posture_status, eye_status, gesture_status, speech_status]
        passed = sum(1 for x in statuses if x == "PASSED")
        failed = sum(1 for x in statuses if x == "FAILED")
        no_data = sum(1 for x in statuses if x == "NO DATA")

        if no_data >= 3:
            final = "NO DATA"
        elif passed >= 3 and failed == 0:
            final = "COMPLETE"
        elif failed >= 1:
            final = "NEEDS WORK"
        else:
            final = "PENDING"

        from collections import Counter
        gesture_counts = Counter(s["gesture_history"])
        dominant_gesture = gesture_counts.most_common(1)[0][0] if gesture_counts else "none"

        return {
            "session_uuid": session_uuid,
            "posture_pct": posture_pct,
            "eye_pct": eye_pct,
            "gesture_pct": gesture_pct,
            "speech_pct": speech_pct,
            "grammar_pct": grammar_pct,
            "confidence_score": confidence,
            "posture_status": posture_status,
            "eye_contact_status": eye_status,
            "gesture_status": gesture_status,
            "speech_status": speech_status,
            "grammar_status": grammar_status_val,
            "final_status": final,
            "wpm": wpm,
            "fillers": fillers,
            "pace": pace,
            "transcript": transcript,
            "grammar_issues": grammar.get("issues", []),
            "grammar_feedback": grammar.get("detailed_feedback", ""),
            "dominant_gesture": dominant_gesture,
            "gesture_variety": len(set(s["gesture_history"]) - {"idle", "fist"}),
            "nervous_signals": s["gesture_nervous"],
            "frames_analyzed": total_p,
            "frames_posture": total_p,
            "frames_eye": total_e,
            "frames_gesture": total_g,
            "audio_captured": s["audio_done"]
        }

    def get_session(self, session_uuid: str):
        return self.sessions.get(session_uuid)


session_manager_instance = SessionManager()