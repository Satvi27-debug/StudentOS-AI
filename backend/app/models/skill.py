from datetime import datetime

from sqlalchemy import DateTime, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    student_skills = relationship("StudentSkill", back_populates="skill", cascade="all, delete-orphan")


class StudentSkill(Base):
    __tablename__ = "student_skills"
    __table_args__ = (UniqueConstraint("student_id", "skill_id", name="uq_student_skill"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"))
    level: Mapped[str] = mapped_column(String(20), default="beginner")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="student_skills")
    skill = relationship("Skill", back_populates="student_skills")