import json
from groq import Groq
from app.config import get_settings

settings = get_settings()


class RoadmapService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def _detect_personality(self, answers: dict):
        traits = {
            "extraversion": 0, "confidence": 0, "resilience": 0,
            "leadership": 0, "risk": 0, "decision_making": 0,
            "emotional_maturity": 0, "accountability": 0
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

        case_conflict = answers.get("case_conflict", {}).get("answer", "")
        if "calmly" in case_conflict.lower():
            traits["emotional_maturity"] = 90
        elif "silent" in case_conflict.lower():
            traits["emotional_maturity"] = 45
        elif "defend" in case_conflict.lower():
            traits["emotional_maturity"] = 55
        else:
            traits["emotional_maturity"] = 30

        case_mistake = answers.get("case_mistake", {}).get("answer", "")
        if "own it" in case_mistake.lower():
            traits["accountability"] = 95
        elif "fix it quietly" in case_mistake.lower():
            traits["accountability"] = 50
        elif "blame" in case_mistake.lower():
            traits["accountability"] = 20
        else:
            traits["accountability"] = 35

        ext = traits["extraversion"]
        conf = traits["confidence"]

        base = "Extrovert" if ext >= 70 else ("Ambivert" if ext >= 40 else "Introvert")
        suffix = "Confident" if conf >= 75 else ("Developing" if conf >= 50 else "Reserved")

        return {
            "type": f"{base}-{suffix}",
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

        if basic.get("interests"):
            lines.append(f"Interests: {', '.join(basic['interests'])}")
        if basic.get("skills"):
            lines.append(f"Skills: {', '.join(basic['skills'])}")

        lines.append("")
        lines.append("All Answers:")
        for key, val in answers.items():
            if isinstance(val, dict) and "question" in val:
                lines.append(f"Q: {val['question']}")
                ans = val['answer']
                if isinstance(ans, list):
                    ans = ', '.join(ans)
                lines.append(f"A: {ans}")
                lines.append("")
        return "\n".join(lines)

    def generate_roadmap(self, answers: dict, basic: dict):
        personality = self._detect_personality(answers)
        formatted = self._format_answers(answers, basic)

        prompt = f"""You are an elite career counselor, life coach, and mentor with 20+ years of experience. Generate a HYPER-DETAILED, honest, actionable 5-year blueprint for this student.

STUDENT PROFILE:
{formatted}

DETECTED PERSONALITY:
Type: {personality['type']}
Traits: {json.dumps(personality['traits'])}

Return ONLY valid JSON in EXACTLY this structure:

{{
  "summary": "3-4 sentence honest overview of who this person is",
  "personality_analysis": "4-5 sentences explaining personality strengths and career implications",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3", "weakness 4"],
  "career_fields": [
    {{"field": "Field 1", "match": 92, "why": "detailed reason", "salary_range": "₹X-Y LPA", "growth": "High/Medium/Low", "difficulty": "Easy/Medium/Hard"}},
    {{"field": "Field 2", "match": 85, "why": "...", "salary_range": "...", "growth": "...", "difficulty": "..."}},
    {{"field": "Field 3", "match": 78, "why": "...", "salary_range": "...", "growth": "...", "difficulty": "..."}}
  ],
  "roadmap_5_year": [
    {{
      "year": "Year 1",
      "theme": "Short theme",
      "goals": ["specific goal 1", "specific goal 2", "specific goal 3", "specific goal 4"],
      "skills": ["technical skill 1", "soft skill 1", "technical skill 2"],
      "weekly_plan": "1-2 sentences on how to spend weekly time",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"]
    }},
    {{"year": "Year 2", "theme": "...", "goals": ["..."], "skills": ["..."], "weekly_plan": "...", "milestones": ["..."]}},
    {{"year": "Year 3", "theme": "...", "goals": ["..."], "skills": ["..."], "weekly_plan": "...", "milestones": ["..."]}},
    {{"year": "Year 4", "theme": "...", "goals": ["..."], "skills": ["..."], "weekly_plan": "...", "milestones": ["..."]}},
    {{"year": "Year 5", "theme": "...", "goals": ["..."], "skills": ["..."], "weekly_plan": "...", "milestones": ["..."]}}
  ],
  "resources": {{
    "books": [
      {{"title": "Book Title", "author": "Author Name", "why": "why to read"}},
      {{"title": "...", "author": "...", "why": "..."}},
      {{"title": "...", "author": "...", "why": "..."}},
      {{"title": "...", "author": "...", "why": "..."}},
      {{"title": "...", "author": "...", "why": "..."}}
    ],
    "youtube_channels": [
      {{"name": "Channel Name", "topic": "what they teach"}},
      {{"name": "...", "topic": "..."}},
      {{"name": "...", "topic": "..."}},
      {{"name": "...", "topic": "..."}}
    ],
    "online_courses": [
      {{"platform": "Coursera/Udemy/etc", "course": "Course name", "why": "why this"}},
      {{"platform": "...", "course": "...", "why": "..."}},
      {{"platform": "...", "course": "...", "why": "..."}}
    ]
  }},
  "brutal_honesty": "3-4 sentences honest wake-up call — what they MUST fix or they will stay stuck forever",
  "pros": ["pro 1", "pro 2", "pro 3", "pro 4"],
  "cons": ["con 1", "con 2", "con 3", "con 4"],
  "immediate_actions": [
    {{"action": "action 1", "deadline": "Within 7 days"}},
    {{"action": "action 2", "deadline": "Within 15 days"}},
    {{"action": "action 3", "deadline": "Within 30 days"}},
    {{"action": "action 4", "deadline": "Within 30 days"}}
  ],
  "common_mistakes": ["mistake 1 to avoid", "mistake 2", "mistake 3", "mistake 4", "mistake 5"],
  "mentor_advice": "2-3 sentences on what kind of mentor to look for and how to find them",
  "financial_planning": "2-3 sentences on how to manage money during early career",
  "backup_plan": "2-3 sentences on realistic backup if primary path fails",
  "interview_prep": ["prep tip 1", "prep tip 2", "prep tip 3", "prep tip 4"],
  "daily_habits": ["habit 1", "habit 2", "habit 3", "habit 4", "habit 5"]
}}

Rules:
- Be HONEST, direct, NO sugarcoating
- Make it SPECIFIC to their answers, not generic
- Salary ranges should be realistic for Indian market (₹ LPA)
- Every recommendation must be actionable
- Books/channels must be REAL and relevant
- ONLY return valid JSON, no markdown, no backticks
"""

        try:
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="openai/gpt-oss-120b",
                temperature=0.7,
                max_tokens=8000
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
