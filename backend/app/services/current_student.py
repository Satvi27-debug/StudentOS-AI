from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models.student import Student


def get_current_student(db: Session = Depends(get_db)) -> Student:
    """
    Return the current development student.

    Level 2 uses a single dev student. Level 3/4 can replace this with
    authentication → current user → student lookup.
    """
    student = db.query(Student).filter(Student.id == settings.DEV_STUDENT_ID).first()
    if not student:
        raise HTTPException(status_code=404, detail="Development student not found. Run the seed script.")
    return student