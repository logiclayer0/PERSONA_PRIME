class FusionEngine:
    def __init__(self):
        self.weights = {
            "posture": 0.25,
            "eye_contact": 0.20,
            "gesture": 0.15,
            "speech": 0.25,
            "grammar": 0.15
        }

    def compute_confidence_score(self, posture_status, eye_status, gesture_status, speech_status, grammar_score):
        score = 0
        score += self.weights["posture"] * (100 if "Good" in posture_status else 40)
        score += self.weights["eye_contact"] * (100 if eye_status == "Good" else 40)
        score += self.weights["gesture"] * (100 if gesture_status == "Active" else 60)
        score += self.weights["speech"] * (100 if "Excellent" in speech_status else (60 if "Good" in speech_status else 30))
        score += self.weights["grammar"] * grammar_score
        return round(score, 1)