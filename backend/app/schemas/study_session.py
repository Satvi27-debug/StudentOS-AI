from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class StudySessionCreate(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None
    duration_minutes: int = Field(..., gt=0, le=1440)
    notes: Optional[str] = None
    session_date: date


class StudySessionResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int
    topic_id: Optional[int] = None
    duration_minutes: int
    notes: Optional[str] = None
    session_date: date
    created_at: datetime

    model_config = {"from_attributes": True}


class StudyStats(BaseModel):
    today_minutes: int
    week_minutes: int
    month_minutes: int
    by_subject: list[dict] = []