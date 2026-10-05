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

STREAM_QUESTIONS = {
    "Science (PCM)": [
        {
            "id": "pcm_favorite",
            "type": "mcq",
            "question": "In Science (PCM), which subject excites you the most?",
            "options": ["Physics", "Chemistry", "Mathematics", "Computer Science", "I'm still exploring"],
            "trait": "stream_interest"
        },
        {
            "id": "pcm_career_pull",
            "type": "mcq",
            "question": "Which career pulls you most strongly?",
            "options": ["Engineering", "Data / AI", "Research Scientist", "Entrepreneurship", "Still deciding"],
            "trait": "career_pull"
        },
        {
            "id": "pcm_hands_on",
            "type": "mcq",
            "question": "Do you enjoy hands-on building (robots, code, machines)?",
            "options": ["Yes, absolutely love it", "Somewhat, occasionally", "I prefer theory", "Not at all"],
            "trait": "hands_on"
        }
    ],
    "Science (PCB)": [
        {
            "id": "pcb_favorite",
            "type": "mcq",
            "question": "In Science (PCB), which subject interests you most?",
            "options": ["Biology", "Chemistry", "Physics", "Psychology", "I'm still exploring"],
            "trait": "stream_interest"
        },
        {
            "id": "pcb_career_pull",
            "type": "mcq",
            "question": "Which career pulls you most strongly?",
            "options": ["Doctor / Surgeon", "Medical Research", "Biotech / Pharma", "Psychology / Counseling", "Still deciding"],
            "trait": "career_pull"
        },
        {
            "id": "pcb_empathy",
            "type": "mcq",
            "question": "How do you handle emotional situations (people in distress)?",
            "options": ["I stay calm and help immediately", "I feel deeply but manage", "I avoid emotional situations", "I need time to process"],
            "trait": "empathy"
        }
    ],
    "Commerce": [
        {
            "id": "commerce_favorite",
            "type": "mcq",
            "question": "In Commerce, which area excites you the most?",
            "options": ["Accounting", "Business Studies", "Economics", "Entrepreneurship", "Finance / Stock Markets"],
            "trait": "stream_interest"
        },
        {
            "id": "commerce_career_pull",
            "type": "mcq",
            "question": "Which career pulls you most strongly?",
            "options": ["CA / CFA", "Business Owner", "Investment Banking", "Marketing / Sales", "Still deciding"],
            "trait": "career_pull"
        },
        {
            "id": "commerce_money",
            "type": "mcq",
            "question": "What matters more in your career?",
            "options": ["High income", "Financial stability", "Business ownership", "Passion > money", "I want both"],
            "trait": "money_mindset"
        }
    ],
    "Arts / Humanities": [
        {
            "id": "arts_favorite",
            "type": "mcq",
            "question": "In Arts / Humanities, which area speaks to you most?",
            "options": ["Literature", "History", "Political Science", "Psychology", "Fine Arts"],
            "trait": "stream_interest"
        },
        {
            "id": "arts_career_pull",
            "type": "mcq",
            "question": "Which career pulls you most strongly?",
            "options": ["Civil Services (UPSC)", "Law", "Media / Journalism", "Designer / Creator", "Still deciding"],
            "trait": "career_pull"
        },
        {
            "id": "arts_expression",
            "type": "mcq",
            "question": "How do you express yourself best?",
            "options": ["Writing", "Speaking / Debating", "Visual / Art", "Music / Performance", "Helping others"],
            "trait": "expression"
        }
    ],
    "Vocational": [
        {
            "id": "voc_skill",
            "type": "mcq",
            "question": "Which skill-based path interests you?",
            "options": ["Coding / IT", "Design / Graphics", "Culinary / Hospitality", "Automotive / Mechanics", "Other hands-on field"],
            "trait": "vocational"
        },
        {
            "id": "voc_job_vs_business",
            "type": "mcq",
            "question": "What do you want after training?",
            "options": ["A stable job", "Start my own business", "Freelance work", "Work abroad", "Not sure yet"],
            "trait": "career_mode"
        },
        {
            "id": "voc_improvement",
            "type": "mcq",
            "question": "How do you feel about continuous skill learning?",
            "options": ["I love learning new things", "I learn only what's needed", "I prefer mastering one skill", "I want to switch often"],
            "trait": "learning_mindset"
        }
    ],
    "Not decided yet": [
        {
            "id": "undecided_pull",
            "type": "mcq",
            "question": "What pulls you the most right now?",
            "options": ["Technology / Innovation", "Business / Money", "Creativity / Art", "Helping people", "Science / Discovery"],
            "trait": "natural_pull"
        },
        {
            "id": "undecided_env",
            "type": "mcq",
            "question": "Which environment feels right?",
            "options": ["A lab or research space", "An office with a team", "A creative studio", "Field work / outdoors", "My own business"],
            "trait": "environment"
        },
        {
            "id": "undecided_timeline",
            "type": "mcq",
            "question": "How much time are you willing to spend exploring before deciding?",
            "options": ["Less than 3 months", "3-6 months", "6-12 months", "As long as it takes"],
            "trait": "decision_timeline"
        }
    ]
}

CASE_BASED_QUESTIONS = [
    {
        "id": "case_deadline",
        "type": "mcq",
        "question": "CASE STUDY: Your team has a deadline tomorrow. You're the only one who knows a key task is incomplete. You:",
        "options": [
            "Tell the team immediately and ask for help",
            "Work overnight and try to finish it alone",
            "Hide it and hope nobody notices",
            "Tell only the leader privately"
        ],
        "trait": "crisis_response"
    },
    {
        "id": "case_conflict",
        "type": "mcq",
        "question": "CASE STUDY: A teammate publicly criticizes your work in front of everyone. You:",
        "options": [
            "Respond calmly with facts, then talk privately later",
            "Defend yourself loudly right there",
            "Stay silent, feel bad all day",
            "Complain to the leader about them"
        ],
        "trait": "conflict_handling"
    },
    {
        "id": "case_opportunity",
        "type": "mcq",
        "question": "CASE STUDY: You get an unexpected opportunity abroad — but it's in a field you have no experience in. You:",
        "options": [
            "Take it and learn on the go",
            "Decline, it's too risky",
            "Ask for time to think and research",
            "Take it but feel anxious the whole time"
        ],
        "trait": "opportunity_response"
    },
    {
        "id": "case_mistake",
        "type": "mcq",
        "question": "CASE STUDY: You realize you made a serious mistake that cost your team a lot. You:",
        "options": [
            "Own it publicly and propose a fix",
            "Fix it quietly without telling anyone",
            "Blame circumstances",
            "Wait and see if anyone notices"
        ],
        "trait": "accountability"
    },
    {
        "id": "case_peer_success",
        "type": "mcq",
        "question": "CASE STUDY: A close friend gets the exact role you wanted. You:",
        "options": [
            "Congratulate genuinely and ask how they did it",
            "Congratulate but feel jealous inside",
            "Distance yourself from them",
            "Complain to others about unfairness"
        ],
        "trait": "emotional_maturity"
    }
]

INTEREST_QUESTIONS = [
    {
        "id": "interests_multi",
        "type": "multi",
        "question": "Which of these genuinely excite you? (Select all that apply)",
        "options": [
            "Coding / Software",
            "AI / Machine Learning",
            "Design / Art",
            "Writing / Blogging",
            "Speaking / Debating",
            "Music / Singing",
            "Sports / Fitness",
            "Business / Startups",
            "Teaching / Mentoring",
            "Research / Science",
            "Photography / Video",
            "Travel / Adventure"
        ],
        "required": True
    },
    {
        "id": "skills_multi",
        "type": "multi",
        "question": "Which skills do you already have some experience in? (Select all)",
        "options": [
            "Programming",
            "Public Speaking",
            "Graphic Design",
            "Content Creation",
            "Data Analysis",
            "Leadership / Management",
            "Foreign Language",
            "Musical Instrument",
            "Sports / Athletics",
            "Entrepreneurship"
        ],
        "required": False
    }
]

ASPIRATION_QUESTIONS = [
    {
        "id": "aspiration_5year",
        "type": "text",
        "question": "In 5 years, where do you see yourself? (Be honest — write anything, no filter)",
        "placeholder": "E.g. Working at a top tech company, or running my own startup, or traveling the world...",
        "required": True
    },
    {
        "id": "aspiration_dream",
        "type": "text",
        "question": "What was your childhood dream? (Even if it sounds silly — write it)",
        "placeholder": "E.g. Astronaut, cricketer, actor, YouTuber, Prime Minister...",
        "required": True
    }
]


def get_questions_for_user(stream: str = None):
    stream_qs = STREAM_QUESTIONS.get(stream, STREAM_QUESTIONS["Not decided yet"])
    return {
        "basic": BASIC_QUESTIONS,
        "personality": PERSONALITY_QUESTIONS,
        "stream_specific": stream_qs,
        "case_based": CASE_BASED_QUESTIONS,
        "interests": INTEREST_QUESTIONS,
        "aspiration": ASPIRATION_QUESTIONS,
        "total": (
            len(BASIC_QUESTIONS) +
            len(PERSONALITY_QUESTIONS) +
            len(stream_qs) +
            len(CASE_BASED_QUESTIONS) +
            len(INTEREST_QUESTIONS) +
            len(ASPIRATION_QUESTIONS)
        )
    }
