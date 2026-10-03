from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.api import auth, video_stream, audio_stream, analytics, script_generator, avatar, discovery

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Persona Prime API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(video_stream.router)
app.include_router(audio_stream.router)
app.include_router(analytics.router)
app.include_router(script_generator.router)
app.include_router(avatar.router)
app.include_router(discovery.router)


@app.get("/")
def root():
    return {"status": "Persona Prime backend is running", "version": "1.0.0"}
