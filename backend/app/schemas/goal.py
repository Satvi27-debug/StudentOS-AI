from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: str = Field(default="personal", pattern="^(study|coding|project|career|research|personal)$")
    target_date: Optional[date] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, pattern="^(study|coding|project|career|research|personal)$")
    target_date: Optional[date] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    status: Optional[str] = Field(None, pattern="^(active|completed)$")


class GoalResponse(BaseModel):
    id: int
    student_id: int
    title: str
    description: Optional[str] = None
    category: str
    target_date: Optional[date] = None
    progress: int
    status: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}