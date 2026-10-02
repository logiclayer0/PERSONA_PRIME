import whisper
import re
import os
from pydub import AudioSegment


class AudioAnalyzer:
    def __init__(self):
        self.model = whisper.load_model("base")
        self.filler_words = ["umm", "uhh", "uh", "um", "like", "ah", "you know", "basically"]

    def transcribe_and_analyze(self, path: str):
        if not os.path.exists(path):
            return {"error": "File not found"}

        try:
            audio = AudioSegment.from_file(path)
            duration = len(audio) / 1000.0
        except Exception:
            duration = 0.0

        try:
            result = self.model.transcribe(path)
            text = result.get("text", "")
        except Exception:
            return {
                "transcript": "",
                "speech_performance": "Warning: Processing Error",
                "filler_words_count": {},
                "total_fillers_detected": 0,
                "wpm": 0,
                "pace_status": "Unknown",
                "events": []
            }

        clean = text.lower()
        words = clean.split()
        wpm = 0
        pace_status = "No Speech"

        if words and duration > 0:
            wpm = round((len(words) / duration) * 60)
            if wpm < 110:
                pace_status = "Too Slow"
            elif wpm <= 160:
                pace_status = "Perfect Pace"
            else:
                pace_status = "Too Fast"

        fillers = {}
        total = 0
        for w in self.filler_words:
            count = len(re.findall(r"\b" + re.escape(w) + r"\b", clean))
            if count:
                fillers[w] = count
                total += count

        events = []
        if total > 3:
            events.append({"type": "filler", "message": f"High fillers ({total})"})
        if "Too" in pace_status:
            events.append({"type": "pace", "message": f"Pace issue: {pace_status}"})

        if total > 3 or "Too" in pace_status:
            perf = f"Warning ({pace_status})"
        elif total > 0:
            perf = f"Good ({pace_status}) - reduce fillers"
        else:
            perf = f"Excellent ({pace_status})"

        return {
            "transcript": text,
            "speech_performance": perf,
            "filler_words_count": fillers,
            "total_fillers_detected": total,
            "wpm": wpm,
            "pace_status": pace_status,
            "events": events
        }