from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.career import CareerProfile
from ..models.student import Student
from ..schemas.career import ProfileResponse, ProfileUpdate
from ..services.current_student import get_current_student

router = APIRouter()


def _profile_to_response(student: Student, career: CareerProfile | None) -> dict:
    return {
        "id": student.id,
        "student_id": student.id,
        "name": student.name,
        "college": getattr(student, "college", None),
        "degree": getattr(student, "degree", None),
        "branch": getattr(student, "branch", None),
        "graduation_year": getattr(student, "graduation_year", None),
        "bio": getattr(student, "bio", None),
        "target_role": career.target_role if career else None,
        "interests": career.interests.split(",") if career and career.interests else [],
        "created_at": student.created_at,
        "updated_at": student.updated_at,
    }


@router.get("", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    career = db.query(CareerProfile).filter(CareerProfile.student_id == student.id).first()
    return _profile_to_response(student, career)


@router.put("", response_model=ProfileResponse)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    for key, value in data.model_dump(exclude_unset=True).items():
        if key in ("target_role", "interests"):
            continue
        setattr(student, key, value)

    career = db.query(CareerProfile).filter(CareerProfile.student_id == student.id).first()
    if not career:
        career = CareerProfile(student_id=student.id)
        db.add(career)

    if data.target_role is not None:
        career.target_role = data.target_role
    if data.interests is not None:
        career.interests = ",".join(data.interests)

    db.commit()
    db.refresh(student)
    db.refresh(career)
    return _profile_to_response(student, career)