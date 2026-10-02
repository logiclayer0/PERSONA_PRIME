from groq import Groq
from app.config import get_settings

settings = get_settings()

TUTOR_PROMPTS = {
    "seraphina": "You are Dr. Seraphina Vance — warm, empathetic, and encouraging. You speak gently and always find something positive to build on. Use phrases like 'You're doing wonderfully', 'Let's refine this together'. Never harsh. Always supportive.",
    "vladimir": "You are Commander Vladimir — strict, precise, and high-standard. You speak with authority and zero tolerance for sloppiness. Use phrases like 'Fix this immediately', 'Unacceptable posture', 'Do better next time'. Blunt but fair.",
    "aurora": "You are Mentor Aurora — expressive, playful, and theatrical. You speak with energy and enthusiasm. Use phrases like 'WOO!', 'That was FIRE!', 'Boo, let's spice it up!'. Fun, dramatic, motivating."
}


class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def generate_script(self, category, topic, duration_minutes, language="English", role="student", tutor_id="seraphina"):
        word_target = duration_minutes * 130
        persona = TUTOR_PROMPTS.get(tutor_id, TUTOR_PROMPTS["seraphina"])
        system_prompt = (
            f"{persona}\n\n"
            f"Generate a {duration_minutes}-minute {category} script in {language} "
            f"for a {role} on the topic: {topic}. "
            f"Target around {word_target} words. Make it natural, confident, and structured. "
            f"Return only the script text, no headings."
        )
        completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Write the script on: {topic}"}
            ],
            model="openai/gpt-oss-120b",
            temperature=0.7,
            max_tokens=2048
        )
        return completion.choices[0].message.content

    def generate_feedback(self, transcript, metrics, tutor_id="seraphina"):
        persona = TUTOR_PROMPTS.get(tutor_id, TUTOR_PROMPTS["seraphina"])
        prompt = f"""
{persona}

Analyze this practice session. Respond in YOUR persona's voice.

Session Data:
- Final Status: {metrics.get('final_status')}
- Confidence Score: {metrics.get('confidence_score')}%
- Posture: {metrics.get('posture_pct')}% good
- Eye Contact: {metrics.get('eye_pct')}% good
- Gesture: {metrics.get('gesture_pct')}% active (nervous signals: {metrics.get('nervous_signals', 0)})
- Speech: {metrics.get('speech_pct')}% strong
- Grammar: {metrics.get('grammar_pct')}% correct
- WPM: {metrics.get('wpm')}
- Fillers: {metrics.get('fillers')}
- Transcript (first 400 chars): {transcript[:400]}

Use EXACTLY this format (no markdown):

🎯 WHAT WENT WELL
- (3 points in your voice)

😅 WHAT NEEDS WORK
- (3 points in your voice)

🚀 YOUR NEXT MOVE
- (1 actionable tip)

💬 {tutor_id.upper()} SAYS
- (1 signature line in your personality)

Keep total under 200 words.
"""
        completion = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-120b",
            temperature=0.8,
            max_tokens=600
        )
        return completion.choices[0].message.content