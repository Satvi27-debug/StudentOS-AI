from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.student import Student
from ..models.study_session import StudySession
from ..models.subject import Subject
from ..schemas.study_session import StudySessionCreate, StudySessionResponse, StudyStats
from ..services.current_student import get_current_student

router = APIRouter()


@router.get("", response_model=list[StudySessionResponse])
def list_sessions(
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    return (
        db.query(StudySession)
        .filter(StudySession.student_id == student.id)
        .order_by(StudySession.session_date.desc())
        .all()
    )


@router.post("", response_model=StudySessionResponse, status_code=201)
def create_session(
    data: StudySessionCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    subject = db.query(Subject).filter(Subject.id == data.subject_id, Subject.student_id == student.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    session = StudySession(student_id=student.id, **data.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/{session_id}", response_model=StudySessionResponse)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    session = db.query(StudySession).filter(StudySession.id == session_id, StudySession.student_id == student.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    return session


@router.delete("/{session_id}", status_code=204)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    session = db.query(StudySession).filter(StudySession.id == session_id, StudySession.student_id == student.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    db.delete(session)
    db.commit()


@router.get("/stats", response_model=StudyStats)
def get_stats(
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    today = date.today()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)

    today_minutes = (
        db.query(func.coalesce(func.sum(StudySession.duration_minutes), 0))
        .filter(StudySession.student_id == student.id, StudySession.session_date == today)
        .scalar()
    )
    week_minutes = (
        db.query(func.coalesce(func.sum(StudySession.duration_minutes), 0))
        .filter(StudySession.student_id == student.id, StudySession.session_date >= week_ago)
        .scalar()
    )
    month_minutes = (
        db.query(func.coalesce(func.sum(StudySession.duration_minutes), 0))
        .filter(StudySession.student_id == student.id, StudySession.session_date >= month_ago)
        .scalar()
    )

    by_subject = (
        db.query(Subject.name, func.coalesce(func.sum(StudySession.duration_minutes), 0).label("minutes"))
        .join(StudySession, StudySession.subject_id == Subject.id)
        .filter(StudySession.student_id == student.id)
        .group_by(Subject.id, Subject.name)
        .order_by(func.sum(StudySession.duration_minutes).desc())
        .all()
    )

    return StudyStats(
        today_minutes=today_minutes,
        week_minutes=week_minutes,
        month_minutes=month_minutes,
        by_subject=[{"subject": name, "minutes": minutes} for name, minutes in by_subject],
    )