from datetime import datetime

from pydantic import BaseModel, Field


class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    level: str = Field(default="beginner", pattern="^(beginner|intermediate|advanced)$")


class SkillUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    level: Optional[str] = Field(None, pattern="^(beginner|intermediate|advanced)$")


class StudentSkillResponse(BaseModel):
    id: int
    student_id: int
    skill_id: int
    level: str
    created_at: datetime
    updated_at: datetime
    skill_name: str = ""

    model_config = {"from_attributes": True}