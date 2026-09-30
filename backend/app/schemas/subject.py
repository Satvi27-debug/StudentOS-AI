from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class SubjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    exam_date: Optional[date] = None


class SubjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    exam_date: Optional[date] = None


class TopicCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)


class TopicUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    status: Optional[str] = Field(None, pattern="^(todo|in_progress|done)$")


class TopicResponse(BaseModel):
    id: int
    subject_id: int
    name: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SubjectResponse(BaseModel):
    id: int
    student_id: int
    name: str
    description: Optional[str] = None
    exam_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime
    topics: list[TopicResponse] = []
    progress: int = 0

    model_config = {"from_attributes": True}