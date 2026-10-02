import json
import re
from groq import Groq
from app.config import get_settings

settings = get_settings()


class GrammarAnalyzer:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.quick_rules = [
            (r"\bi am agree\b", "I agree", "Drop 'am' before 'agree'"),
            (r"\bmore better\b", "better", "Don't double the comparative"),
            (r"\bdidn't went\b", "didn't go", "Use base verb after 'didn't'"),
            (r"\bhe don't\b", "he doesn't", "Third person singular needs 'doesn't'"),
            (r"\bshe don't\b", "she doesn't", "Third person singular needs 'doesn't'"),
            (r"\bi has\b", "I have", "First person uses 'have'"),
            (r"\bthey was\b", "they were", "Plural subject needs 'were'"),
            (r"\bwe was\b", "we were", "Plural subject needs 'were'"),
            (r"\bi seen\b", "I saw", "Past tense of 'see' is 'saw'"),
            (r"\bcould of\b", "could have", "Use 'have' not 'of'"),
            (r"\bshould of\b", "should have", "Use 'have' not 'of'"),
            (r"\bwould of\b", "would have", "Use 'have' not 'of'")
        ]

    def quick_check(self, text: str):
        text_lower = text.lower()
        issues = []

        for pattern, correction, rule in self.quick_rules:
            if re.search(pattern, text_lower):
                issues.append({
                    "found": pattern.replace(r"\b", ""),
                    "suggestion": correction,
                    "rule": rule
                })

        return issues

    def analyze(self, transcript: str):
        if not transcript or len(transcript.strip()) < 20:
            return {
                "grammar_score": 0,
                "total_errors": 0,
                "issues": [],
                "detailed_feedback": "",
                "status": "NO DATA"
            }

        quick_issues = self.quick_check(transcript)

        try:
            prompt = f"""Analyze this speech transcript for grammar mistakes. Return ONLY valid JSON.

Transcript:
"{transcript[:2000]}"

Return JSON with this exact structure:
{{
  "errors": [
    {{"original": "wrong phrase", "correction": "correct phrase", "explanation": "short reason"}}
  ],
  "score": 85,
  "summary": "one-line summary of grammar level"
}}

Rules:
- Find up to 5 real grammar issues (articles, tense, prepositions, agreement, word order).
- Score MUST be between 0 and 99. NEVER output 100.
- Even if the transcript is perfect, give 95-98 — never 100.
- Ignore filler words (um, uh).
- If no errors, return empty errors array with score 95-98.
- ONLY return valid JSON. No markdown, no backticks.
"""

            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="openai/gpt-oss-120b",
                temperature=0.3,
                max_tokens=800
            )

            raw = completion.choices[0].message.content.strip()
            raw = raw.replace("```json", "").replace("```", "").strip()

            data = json.loads(raw)

            llm_errors = data.get("errors", [])[:5]
            score = data.get("score", 70)
            summary = data.get("summary", "")

            if score > 99:
                score = 99

            if len(llm_errors) > 0 and score > 95:
                score = 95

            all_issues = quick_issues + llm_errors

            if score >= 70:
                status = "PASSED"
            else:
                status = "FAILED"

            return {
                "grammar_score": score,
                "total_errors": len(all_issues),
                "issues": all_issues[:6],
                "detailed_feedback": summary,
                "status": status
            }

        except Exception:
            fallback_score = max(0, 100 - len(quick_issues) * 10)

            if fallback_score > 99:
                fallback_score = 99

            status = "PASSED" if fallback_score >= 60 else "FAILED"

            return {
                "grammar_score": fallback_score,
                "total_errors": len(quick_issues),
                "issues": quick_issues,
                "detailed_feedback": "Basic pattern check applied",
                "status": status
            }