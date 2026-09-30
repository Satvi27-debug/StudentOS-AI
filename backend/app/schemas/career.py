from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    college: Optional[str] = Field(None, max_length=200)
    degree: Optional[str] = Field(None, max_length=200)
    branch: Optional[str] = Field(None, max_length=200)
    graduation_year: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = None
    target_role: Optional[str] = Field(None, max_length=200)
    interests: Optional[list[str]] = None


class ProfileResponse(BaseModel):
    id: int
    student_id: int
    name: str
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[str] = None
    bio: Optional[str] = None
    target_role: Optional[str] = None
    interests: list[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}