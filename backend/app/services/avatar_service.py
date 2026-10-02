import requests
import time
from app.config import get_settings

settings = get_settings()


class AvatarService:
    def __init__(self):
        self.did_key = settings.DID_API_KEY
        self.heygen_key = settings.HEYGEN_API_KEY

    def generate_talking_video(self, text: str, tutor_id: str, photo_url: str):
        if not self.did_key:
            return {
                "status": "error",
                "message": "D-ID key not configured",
                "video_url": None
            }

        try:
            res = requests.post(
                "https://api.d-id.com/talks",
                json={
                    "script": {
                        "type": "text",
                        "subtitles": "false",
                        "provider": {
                            "type": "microsoft",
                            "voice_id": "en-US-JennyNeural"
                        },
                        "input": text
                    },
                    "config": {
                        "fluent": "false",
                        "pad_audio": "0.0"
                    },
                    "source_url": photo_url
                },
                headers={
                    "accept": "application/json",
                    "content-type": "application/json",
                    "authorization": f"Basic {self.did_key}"
                }
            )

            if res.status_code != 201:
                return {
                    "status": "error",
                    "message": f"D-ID API error: {res.status_code} - {res.text[:200]}",
                    "video_url": None
                }

            talk_data = res.json()
            talk_id = talk_data.get("id")

            if not talk_id:
                return {
                    "status": "error",
                    "message": "No talk ID returned from D-ID",
                    "video_url": None
                }

            for _ in range(40):
                time.sleep(2)
                status_res = requests.get(
                    f"https://api.d-id.com/talks/{talk_id}",
                    headers={"authorization": f"Basic {self.did_key}"}
                )
                status_data = status_res.json()
                state = status_data.get("status")

                if state == "done":
                    return {
                        "status": "success",
                        "video_url": status_data.get("result_url"),
                        "duration": status_data.get("duration")
                    }
                elif state == "error":
                    return {
                        "status": "error",
                        "message": status_data.get("error", {}).get("description", "Unknown error"),
                        "video_url": None
                    }

            return {
                "status": "timeout",
                "message": "Video generation timed out",
                "video_url": None
            }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "video_url": None
            }