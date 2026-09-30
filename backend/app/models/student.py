from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(200), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tasks = relationship("Task", back_populates="student", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="student", cascade="all, delete-orphan")
    subjects = relationship("Subject", back_populates="student", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    student_skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    career_profile = relationship("CareerProfile", back_populates="student", uselist=False, cascade="all, delete-orphan")