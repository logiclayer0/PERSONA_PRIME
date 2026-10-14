# Persona Prime

**AI-assisted personal development and communication coaching.**

Persona Prime helps users explore their strengths, reflect on their personality and goals, build a personalized development blueprint, and practise communication through speech and video feedback. [...]

<p align="center">
  <a href="https://persona-prime.vercel.app"><strong>Live Application</strong></a>
  ·
  <a href="https://github.com/logiclayer0/PERSONA_PRIME/issues">Report an Issue</a>
  ·
  <a href="https://github.com/logiclayer0/PERSONA_PRIME/pulls">Contribute</a>
</p>

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=20232A)
![Python](https://img.shields.io/badge/Backend-Python-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Demo

**Video walkthrough:** `[Add YouTube demo link here]`

Replace the placeholder above with the public or unlisted YouTube URL after uploading the project demo.

**Live app:** https://persona-prime.vercel.app

> The frontend and backend are deployed separately. Features that require the backend or external AI services depend on their current availability and configuration.

## The Problem

Students and early-career learners often need more than a list of goals: they need help understanding themselves, choosing meaningful development areas, practising communication, and turning feedb[...]

## The Solution

Persona Prime combines self-discovery, personalized guidance, communication practice, and progress tracking in one experience. It is designed to help users turn reflection into a practical plan an[...]

## Features

### 1. Discover Yourself
- Guided questions for reflecting on personal preferences, experiences, interests, and development goals.
- Saves discovery progress so users can continue their profile-building journey.
- Uses submitted answers to generate a personalized profile and development roadmap.

### 2. Personal Development Blueprint
- Generates a structured roadmap from discovery responses and profile information.
- Includes a personality-style summary, confidence-related indicators, strengths, development areas, and suggested next steps where available.
- Supports viewing the saved roadmap and exporting it as a PDF.

*Generated personality and confidence indicators are guidance based on the application's current scoring and AI workflow; they are not clinical or psychometric assessments.*

### 3. Communication Practice Studio
- A guided flow for choosing a role or practice category, selecting content, and preparing a script.
- Recording-studio workflow for practising delivery.
- Video-analysis pipeline built around MediaPipe and OpenCV for posture, face/eye-direction signals, and hand gestures.
- Speech-analysis pipeline built around Whisper for transcription, speaking pace, and filler-word detection.

### 4. Feedback and Reports
- Combines available session signals into feedback and a report-oriented practice flow.
- Presents communication observations intended to help users identify areas to practise.
- Results depend on camera/audio quality, model behaviour, and successful processing of the session.

### 5. Progress and Personal Settings
- Progress and session-related views.
- Account profile, preferences, theme, and reminder settings.
- Authentication-protected application routes and token-based API authentication.

### 6. Interactive Persona Experience
- An in-app floating avatar experience and interface elements that support the product's guided-coaching concept.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| UI and interaction | CSS, Framer Motion |
| State and requests | Zustand, Axios |
| 3D / avatar support | Three.js, React Three Fiber, Drei |
| Backend API | Python, FastAPI, Uvicorn |
| Data validation and configuration | Pydantic, pydantic-settings, python-dotenv |
| Persistence | SQLAlchemy; SQLite by default, configurable via `DATABASE_URL` |
| Authentication | JWT via python-jose, password hashing via Passlib/bcrypt |
| Video / vision | MediaPipe, OpenCV, NumPy |
| Speech analysis | OpenAI Whisper, PyDub, FFmpeg |
| AI roadmap generation | Groq API |
| PDF export | ReportLab |
| Deployment | Vercel frontend; Render-compatible FastAPI backend |

## Architecture

The application uses a separate frontend and backend:

```text
Persona Prime
├── frontend/                 React + Vite single-page application
│   └── src/
│       ├── pages/            Landing, auth, dashboard, discovery,
│       │                     blueprint, studio, reports, progress, settings
│       ├── components/       Shared UI and avatar components
│       ├── services/         API request helpers
│       ├── context/          Theme context
│       └── store/            Client-side application state
│
├── backend/                  FastAPI service
│   └── app/
│       ├── api/              Authentication, discovery, audio, video,
│       │                     analytics, scripts and avatar routes
│       ├── core/              Audio, pose, gesture and session analysis
│       ├── models/            SQLAlchemy data models
│       ├── schemas/           Request and response schemas
│       ├── data/              Discovery question data
│       └── services/          Roadmap and AI-related services
│
├── docker-compose.yml
└── README.md
```

### Sequence flow (simplified)

Below is a short, linear sequence flow that mirrors the separation-of-concerns style in the referenced architecture diagram. It highlights where the system pauses, which components stream data, and how analysis results flow back to the user.

1. User (browser) — interacts with the React frontend UI (landing, discovery, studio, etc.).
2. Frontend — makes REST API calls for profile/discovery/roadmap and opens a WebSocket for real-time video frame streaming to the backend's `/video/analyze` endpoint.
3. Backend — receives requests and WebSocket frames, routes video/audio to analysis pipelines (MediaPipe/OpenCV, Whisper), performs inference, and stores intermediate results.
4. AI & external services — Groq (roadmap generation), Whisper (speech->text), and any other external models are called by the backend services as needed.
5. Persistence & events — processed signals, session summaries, and roadmap drafts are saved to the database and published to the frontend via API responses or WebSocket messages.
6. Frontend — receives analysis/roadmap results, renders feedback and reports, and allows PDF export or further user interaction.

```text
User (browser)  ---> Frontend (React)  ---> Backend (FastAPI)  ---> AI / Analysis services
    (UI)               (REST / WS)            (WS + pipelines)        (Whisper, Groq, MediaPipe)
         <--- results, events, roadmap, feedback -------------------------------
```

Notes and extension ideas:

- The unnumbered "pause" in the flow (where the frontend waits for the backend to process a streamed session) is the point to optimise for UX: show live progress, partial results, and retry options.
- For documentation and diagrams, consider adding a Mermaid sequence diagram or PNG/SVG image in `/docs/` and linking it from the README for a visual version like the one you shared.
- If you'd like the README to include an exact replica of an external diagram, provide the image file (or a link) and I can add it and reference it in the README.

### Request and analysis flow

1. The user interacts with the React frontend.
2. The frontend calls the FastAPI backend for authentication, profile, discovery, roadmap, and session operations.
3. Discovery responses are saved and used to build a personalized roadmap.
4. During communication practice, video and audio inputs are sent to their respective analysis workflows.
5. Available analysis results are used to provide feedback and support progress-oriented views.

## Getting Started

### Prerequisites

- Git
- Node.js and npm (Node.js 18 or later recommended)
- Python 3.11 recommended for the backend
- FFmpeg for audio processing
- A Groq API key for AI roadmap generation

### 1. Clone the repository

```bash
git clone https://github.com/logiclayer0/PERSONA_PRIME.git
cd PERSONA_PRIME
```

### 2. Configure the backend

Create and activate a virtual environment from the repository root:

**Windows (PowerShell)**

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

**macOS / Linux**

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Create `backend/.env` with the configuration below. Do not commit this file or real API keys.

```dotenv
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=replace_with_a_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./persona_prime.db
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://persona-prime.vercel.app
```

Generate a strong, unique `SECRET_KEY` for any deployed environment. Configure the database URL and allowed frontend origins for your own deployment.

Run the API from the backend directory:

```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

When the API is running, interactive API documentation is available at:

- Swagger UI: http://127.0.0.1:8000/docs
- OpenAPI schema: http://127.0.0.1:8000/openapi.json

### 3. Configure and run the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local development URL, normally http://localhost:5173.

**Backend URL configuration:** make sure the frontend's API service points to the backend URL you are running. In production, configure it to use the deployed API URL rather than a localhost addr[...]

### 4. Optional: Docker Compose

The repository includes a Docker Compose configuration. Review its `env_file` and service settings before running it; the current configuration expects `backend/.env` to exist.

```bash
docker compose up --build
```

## API Overview

The FastAPI application groups its functionality into these route areas:

| Area | Purpose |
|---|---|
| `/auth` | Registration, login, current user, profile and preferences |
| `/discovery` | Questions, saved discovery profile, completion, roadmap and PDF export |
| `/audio` | Uploaded-audio analysis |
| `/video/analyze` | WebSocket-based video frame analysis |
| Analytics, scripts and avatar routes | Supporting communication-practice workflows |

For exact request schemas and available operations, use the running service's Swagger UI at `/docs`. The video analysis endpoint is a WebSocket endpoint, not a regular HTTP upload route.

## Configuration and Security

- Keep `backend/.env`, credentials, and API keys out of version control.
- Set a strong `SECRET_KEY` in every non-local environment; do not rely on development defaults.
- Restrict `FRONTEND_ORIGINS` to trusted frontend origins.
- Use HTTPS for deployed services and avoid sending real user data to untrusted environments.
- Treat AI-generated roadmaps and computer-vision / speech feedback as estimates for practice, not definitive judgements about a person.

## Current Limitations

- Speech analysis loads the Whisper model on first use. Model initialization and inference can require substantial memory and processing time; small hosting instances may not support this reliabl[...]
- Video analysis depends on a compatible MediaPipe installation and available CPU/memory resources.
- AI roadmap generation requires a valid Groq API key and network access to the provider.
- Analysis quality may vary with lighting, camera position, background noise, microphone quality, accent, and recording length.
- Deployment availability depends on the status and configuration of the separately hosted frontend and backend.

## Development Priorities

- Add automated tests for authentication, discovery, roadmap generation, and analysis endpoints.
- Improve error handling and observability for AI and media-processing failures.
- Validate production environment configuration and database persistence.
- Continue accessibility, responsive-layout, and end-to-end workflow testing.

## Contributing

Contributions and constructive feedback are welcome. Before submitting a change:

1. Explain the issue or improvement.
2. Keep changes focused and avoid committing credentials or generated data.
3. Test the affected frontend or backend workflow.
4. Include clear reproduction steps for bug reports.

Use the repository's Issues page to report bugs or suggest improvements.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.

## Links

- **Live application:** https://persona-prime.vercel.app
- **Source code:** https://github.com/logiclayer0/PERSONA_PRIME
- **Issues:** https://github.com/logiclayer0/PERSONA_PRIME/issues
- **Pull requests:** https://github.com/logiclayer0/PERSONA_PRIME/pulls

---

<p align="center"><strong>Persona Prime — Discover your strengths. Practise with purpose. Grow with a plan.</strong></p>
