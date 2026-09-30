from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.skill import Skill, StudentSkill
from ..models.student import Student
from ..schemas.skill import SkillCreate, SkillUpdate, StudentSkillResponse
from ..services.current_student import get_current_student

router = APIRouter()


@router.get("", response_model=list[StudentSkillResponse])
def list_skills(
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    rows = (
        db.query(StudentSkill, Skill.name.label("skill_name"))
        .join(Skill, Skill.id == StudentSkill.skill_id)
        .filter(StudentSkill.student_id == student.id)
        .all()
    )
    result = []
    for ss, skill_name in rows:
        result.append({
            "id": ss.id,
            "student_id": ss.student_id,
            "skill_id": ss.skill_id,
            "level": ss.level,
            "created_at": ss.created_at,
            "updated_at": ss.updated_at,
            "skill_name": skill_name,
        })
    return result


@router.post("", response_model=StudentSkillResponse, status_code=201)
def create_skill(
    data: SkillCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    skill = db.query(Skill).filter(Skill.name.ilike(data.name)).first()
    if not skill:
        skill = Skill(name=data.name)
        db.add(skill)
        db.commit()
        db.refresh(skill)

    existing = (
        db.query(StudentSkill)
        .filter(StudentSkill.student_id == student.id, StudentSkill.skill_id == skill.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Skill already exists for this student")

    student_skill = StudentSkill(student_id=student.id, skill_id=skill.id, level=data.level)
    db.add(student_skill)
    db.commit()
    db.refresh(student_skill)
    return {
        "id": student_skill.id,
        "student_id": student_skill.student_id,
        "skill_id": student_skill.skill_id,
        "level": student_skill.level,
        "created_at": student_skill.created_at,
        "updated_at": student_skill.updated_at,
        "skill_name": skill.name,
    }


@router.put("/{student_skill_id}", response_model=StudentSkillResponse)
def update_skill(
    student_skill_id: int,
    data: SkillUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    ss = (
        db.query(StudentSkill)
        .filter(StudentSkill.id == student_skill_id, StudentSkill.student_id == student.id)
        .first()
    )
    if not ss:
        raise HTTPException(status_code=404, detail="Skill not found")

    if data.level:
        ss.level = data.level
    if data.name:
        skill = db.query(Skill).filter(Skill.name.ilike(data.name)).first()
        if not skill:
            skill = Skill(name=data.name)
            db.add(skill)
            db.commit()
            db.refresh(skill)
        ss.skill_id = skill.id

    db.commit()
    db.refresh(ss)
    skill = db.query(Skill).filter(Skill.id == ss.skill_id).first()
    return {
        "id": ss.id,
        "student_id": ss.student_id,
        "skill_id": ss.skill_id,
        "level": ss.level,
        "created_at": ss.created_at,
        "updated_at": ss.updated_at,
        "skill_name": skill.name if skill else "",
    }


@router.delete("/{student_skill_id}", status_code=204)
def delete_skill(
    student_skill_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    ss = (
        db.query(StudentSkill)
        .filter(StudentSkill.id == student_skill_id, StudentSkill.student_id == student.id)
        .first()
    )
    if not ss:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(ss)
    db.commit()