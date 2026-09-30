from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: str = Field(default="personal", pattern="^(study|coding|project|career|research|personal)$")
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    due_date: Optional[date] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, pattern="^(study|coding|project|career|research|personal)$")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    status: Optional[str] = Field(None, pattern="^(todo|done)$")
    due_date: Optional[date] = None


class TaskResponse(BaseModel):
    id: int
    student_id: int
    title: str
    description: Optional[str] = None
    category: str
    priority: str
    status: str
    due_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}