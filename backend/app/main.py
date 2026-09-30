from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import dashboard, goals, profile, projects, skills, study_sessions, subjects, tasks

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StudentOS AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(goals.router, prefix="/api/goals", tags=["goals"])
app.include_router(subjects.router, prefix="/api", tags=["subjects"])
app.include_router(study_sessions.router, prefix="/api/study-sessions", tags=["study-sessions"])
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/api/health")
def health():
    return {"status": "ok"}