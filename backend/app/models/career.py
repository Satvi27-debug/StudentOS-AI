from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class CareerProfile(Base):
    __tablename__ = "career_profiles"
    __table_args__ = (UniqueConstraint("student_id", name="uq_career_profile_student"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), unique=True)
    target_role: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    interests: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="career_profile")