from datetime import date, datetime
from typing import Optional

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class StudySession(Base):
    __tablename__ = "study_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"))
    topic_id: Mapped[Optional[int]] = mapped_column(ForeignKey("topics.id", ondelete="SET NULL", nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    session_date: Mapped[date] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="study_sessions")
    subject = relationship("Subject")
    topic = relationship("Topic")