import json
from groq import Groq
from app.config import get_settings

settings = get_settings()


class RoadmapService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def _detect_personality(self, answers: dict):
        traits = {
            "extraversion": 0,
            "confidence": 0,
            "resilience": 0,
            "leadership": 0,
            "risk": 0,
            "decision_making": 0
        }

        social = answers.get("social_battery", {}).get("answer", "")
        if "alone" in social.lower():
            traits["extraversion"] = 30
        elif "1-2" in social:
            traits["extraversion"] = 50
        elif "big group" in social.lower():
            traits["extraversion"] = 85
        else:
            traits["extraversion"] = 60

        new_people = answers.get("new_people", {}).get("answer", "")
        if "wait" in new_people.lower():
            traits["extraversion"] = max(0, traits["extraversion"] - 10)
        elif "start" in new_people.lower():
            traits["extraversion"] = min(100, traits["extraversion"] + 15)

        stage = answers.get("stage_fear", {}).get("answer", "")
        if "look forward" in stage.lower():
            traits["confidence"] = 90
        elif "nervous but manage" in stage.lower():
            traits["confidence"] = 65
        elif "avoid" in stage.lower():
            traits["confidence"] = 40
        else:
            traits["confidence"] = 20

        failure = answers.get("failure_response", {}).get("answer", "")
        if "analyze" in failure.lower():
            traits["resilience"] = 85
        elif "move on" in failure.lower():
            traits["resilience"] = 70
        elif "ask for help" in failure.lower():
            traits["resilience"] = 60
        else:
            traits["resilience"] = 35

        team = answers.get("team_role", {}).get("answer", "")
        if "leader" in team.lower():
            traits["leadership"] = 90
        elif "executor" in team.lower():
            traits["leadership"] = 60
        elif "idea" in team.lower():
            traits["leadership"] = 70
        else:
            traits["leadership"] = 50

        risk = answers.get("risk_appetite", {}).get("answer", "")
        if "immediately" in risk.lower():
            traits["risk"] = 90
        elif "research" in risk.lower():
            traits["risk"] = 55
        elif "talk to many" in risk.lower():
            traits["risk"] = 65
        else:
            traits["risk"] = 25

        decision = answers.get("decision_style", {}).get("answer", "")
        if "analyze" in decision.lower():
            traits["decision_making"] = 85
        elif "gut" in decision.lower():
            traits["decision_making"] = 60
        elif "ask others" in decision.lower():
            traits["decision_making"] = 55
        else:
            traits["decision_making"] = 30

        ext = traits["extraversion"]
        conf = traits["confidence"]

        if ext >= 70:
            base = "Extrovert"
        elif ext >= 40:
            base = "Ambivert"
        else:
            base = "Introvert"

        if conf >= 75:
            suffix = "Confident"
        elif conf >= 50:
            suffix = "Developing"
        else:
            suffix = "Reserved"

        personality_type = f"{base}-{suffix}"

        return {
            "type": personality_type,
            "traits": traits,
            "confidence_score": round(sum(traits.values()) / len(traits), 1)
        }

    def _format_answers(self, answers: dict, basic: dict):
        lines = []
        lines.append(f"Name: {basic.get('full_name', 'User')}")
        lines.append(f"Education: {basic.get('education_level', 'N/A')} — Stream: {basic.get('education_stream', 'N/A')}")
        lines.append(f"Institution: {basic.get('institution', 'N/A')}")
        lines.append(f"Current Year: {basic.get('current_year', 'N/A')}")
        lines.append(f"City: {basic.get('city', 'N/A')}")
        lines.append("")
        lines.append("Personality Answers:")
        for key, val in answers.items():
            if isinstance(val, dict) and "question" in val:
                lines.append(f"- {val['question']}")
                lines.append(f"  → {val['answer']}")
        return "\n".join(lines)

    def generate_roadmap(self, answers: dict, basic: dict):
        personality = self._detect_personality(answers)
        formatted = self._format_answers(answers, basic)

        prompt = f"""You are an expert career counselor and life coach. Analyze this student's profile and generate a detailed, honest, personalized 5-year roadmap.

STUDENT PROFILE:
{formatted}

DETECTED PERSONALITY:
- Type: {personality['type']}
- Traits: {json.dumps(personality['traits'])}

Generate a comprehensive analysis in EXACTLY this JSON format:

{{
  "summary": "2-3 sentence honest overview of who this person is",
  "personality_analysis": "3-4 sentences explaining their personality strengths and how it affects their career",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "career_fields": [
    {{"field": "Field 1", "match": 92, "why": "reason in 1 sentence"}},
    {{"field": "Field 2", "match": 85, "why": "reason in 1 sentence"}},
    {{"field": "Field 3", "match": 78, "why": "reason in 1 sentence"}}
  ],
  "roadmap_5_year": [
    {{"year": "Year 1", "theme": "Short theme", "goals": ["goal 1", "goal 2", "goal 3"], "skills": ["skill 1", "skill 2"]}},
    {{"year": "Year 2", "theme": "...", "goals": ["...", "...", "..."], "skills": ["...", "..."]}},
    {{"year": "Year 3", "theme": "...", "goals": ["...", "...", "..."], "skills": ["...", "..."]}},
    {{"year": "Year 4", "theme": "...", "goals": ["...", "...", "..."], "skills": ["...", "..."]}},
    {{"year": "Year 5", "theme": "...", "goals": ["...", "...", "..."], "skills": ["...", "..."]}}
  ],
  "brutal_honesty": "A 2-3 sentence honest wake-up call — what they must fix or they will stay stuck",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "immediate_actions": ["action 1 for next 30 days", "action 2", "action 3"]
}}

Rules:
- Be HONEST and direct. No sugarcoating.
- Match careers based on their ACTUAL answers, not generic suggestions.
- Match % should be realistic (60-95 range).
- Each field in roadmap must be specific and actionable.
- ONLY return valid JSON. No markdown. No backticks.
"""

        try:
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="openai/gpt-oss-120b",
                temperature=0.7,
                max_tokens=4000
            )

            raw = completion.choices[0].message.content.strip()
            raw = raw.replace("```json", "").replace("```", "").strip()

            data = json.loads(raw)
            data["personality_type"] = personality["type"]
            data["personality_traits"] = personality["traits"]
            data["confidence_score"] = personality["confidence_score"]

            return data

        except Exception as e:
            return {
                "error": str(e),
                "summary": "Unable to generate roadmap at this time.",
                "personality_type": personality["type"],
                "personality_traits": personality["traits"],
                "confidence_score": personality["confidence_score"]
            }
