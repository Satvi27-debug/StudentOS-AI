from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    technology: Optional[str] = None
    deadline: Optional[date] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    technology: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(planning|in_progress|paused|completed)$")
    deadline: Optional[date] = None


class ProjectTaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)


class ProjectTaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    done: Optional[bool] = None


class ProjectTaskResponse(BaseModel):
    id: int
    project_id: int
    title: str
    done: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectResponse(BaseModel):
    id: int
    student_id: int
    name: str
    description: Optional[str] = None
    technology: Optional[str] = None
    status: str
    deadline: Optional[date] = None
    created_at: datetime
    updated_at: datetime
    tasks: list[ProjectTaskResponse] = []
    progress: int = 0

    model_config = {"from_attributes": True}