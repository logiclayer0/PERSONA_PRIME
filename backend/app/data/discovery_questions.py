BASIC_QUESTIONS = [
    {
        "id": "full_name",
        "type": "text",
        "question": "What is your full name?",
        "placeholder": "Enter your name",
        "required": True
    },
    {
        "id": "education_stream",
        "type": "mcq",
        "question": "Which stream did you choose in school?",
        "options": ["Science (PCM)", "Science (PCB)", "Commerce", "Arts / Humanities", "Vocational", "Not decided yet"],
        "required": True
    },
    {
        "id": "education_level",
        "type": "mcq",
        "question": "What is your current education level?",
        "options": ["Class 10", "Class 11", "Class 12", "Undergraduate", "Postgraduate", "Working Professional", "Other"],
        "required": True
    },
    {
        "id": "institution",
        "type": "text",
        "question": "Which school / college are you in?",
        "placeholder": "Institution name",
        "required": True
    },
    {
        "id": "current_year",
        "type": "text",
        "question": "Current year / semester?",
        "placeholder": "e.g. 2nd year, 4th sem",
        "required": True
    },
    {
        "id": "city",
        "type": "text",
        "question": "Which city are you from?",
        "placeholder": "City name",
        "required": False
    }
]

PERSONALITY_QUESTIONS = [
    {
        "id": "social_battery",
        "type": "mcq",
        "question": "After a long day, how do you recharge?",
        "options": [
            "Being alone with my thoughts",
            "With 1-2 close friends",
            "With a big group of friends",
            "Depends on my mood"
        ],
        "trait": "extraversion"
    },
    {
        "id": "new_people",
        "type": "mcq",
        "question": "When you meet new people, you usually:",
        "options": [
            "Wait for them to approach first",
            "Start the conversation myself",
            "Observe quietly and then open up",
            "I avoid meeting new people when possible"
        ],
        "trait": "extraversion"
    },
    {
        "id": "stage_fear",
        "type": "mcq",
        "question": "If you had to speak in front of 100 people tomorrow:",
        "options": [
            "I would look forward to it",
            "I would be nervous but manage",
            "I would try to avoid it",
            "I would panic"
        ],
        "trait": "confidence"
    },
    {
        "id": "decision_style",
        "type": "mcq",
        "question": "When making an important decision, you:",
        "options": [
            "Analyze all options carefully first",
            "Trust my gut instantly",
            "Ask others for advice",
            "Delay as long as possible"
        ],
        "trait": "decision_making"
    },
    {
        "id": "failure_response",
        "type": "mcq",
        "question": "When you fail at something important:",
        "options": [
            "Analyze what went wrong and try again",
            "Feel bad for a while, then move on",
            "Avoid trying again for a long time",
            "Ask for help from someone experienced"
        ],
        "trait": "resilience"
    },
    {
        "id": "team_role",
        "type": "mcq",
        "question": "In a team project, you naturally become:",
        "options": [
            "The leader who organizes everything",
            "The executor who does the work",
            "The idea generator who brainstorms",
            "The supporter who helps everyone"
        ],
        "trait": "leadership"
    },
    {
        "id": "learning_style",
        "type": "mcq",
        "question": "You learn best by:",
        "options": [
            "Reading and taking notes",
            "Watching videos or demonstrations",
            "Doing it hands-on",
            "Discussing with others"
        ],
        "trait": "learning"
    },
    {
        "id": "work_preference",
        "type": "mcq",
        "question": "Which work environment suits you most?",
        "options": [
            "Structured with clear rules",
            "Flexible and creative",
            "Fast-paced and competitive",
            "Collaborative and people-focused"
        ],
        "trait": "work_style"
    },
    {
        "id": "risk_appetite",
        "type": "mcq",
        "question": "If you had a business idea, you would:",
        "options": [
            "Start working on it immediately",
            "Research for months before starting",
            "Talk to many people first",
            "Stick to a stable job instead"
        ],
        "trait": "risk"
    }
]