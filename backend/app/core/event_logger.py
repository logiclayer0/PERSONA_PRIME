import time
from typing import Optional


class EventLogger:
    def __init__(self):
        self.events = []
        self.start_time = time.time()
        self.session_uuid: Optional[str] = None

    def set_session(self, session_uuid: str):
        self.session_uuid = session_uuid

    def log(self, event_type: str, message: str, severity: str = "info"):
        elapsed = round(time.time() - self.start_time, 1)
        event = {
            "timestamp": elapsed,
            "formatted": self._fmt(elapsed),
            "type": event_type,
            "message": message,
            "severity": severity
        }
        self.events.append(event)
        return event

    def _fmt(self, seconds: float) -> str:
        m = int(seconds // 60)
        s = int(seconds % 60)
        return f"{m:02d}:{s:02d}"

    def get_timeline(self):
        return self.events

    def reset(self):
        self.events = []
        self.start_time = time.time()

    def get_summary(self):
        summary = {}
        for e in self.events:
            summary[e["type"]] = summary.get(e["type"], 0) + 1
        return summary