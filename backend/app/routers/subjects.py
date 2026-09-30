from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.student import Student
from ..models.subject import Subject, Topic
from ..schemas.subject import SubjectCreate, SubjectResponse, SubjectUpdate, TopicCreate, TopicResponse, TopicUpdate
from ..services.current_student import get_current_student

router = APIRouter()


def _subject_to_response(subject: Subject) -> dict:
    total = len(subject.topics)
    done = sum(1 for t in subject.topics if t.status == "done")
    progress = round((done / total) * 100) if total > 0 else 0
    return {
        "id": subject.id,
        "student_id": subject.student_id,
        "name": subject.name,
        "description": subject.description,
        "exam_date": subject.exam_date,
        "created_at": subject.created_at,
        "updated_at": subject.updated_at,
        "topics": subject.topics,
        "progress": progress,
    }


@router.get("/subjects", response_model=list[SubjectResponse])
def list_subjects(
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    subjects = db.query(Subject).filter(Subject.student_id == student.id).all()
    return [_subject_to_response(s) for s in subjects]


@router.post("/subjects", response_model=SubjectResponse, status_code=201)
def create_subject(
    data: SubjectCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    subject = Subject(student_id=student.id, **data.model_dump())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return _subject_to_response(subject)


@router.put("/subjects/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int,
    data: SubjectUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.student_id == student.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(subject, key, value)
    db.commit()
    db.refresh(subject)
    return _subject_to_response(subject)


@router.delete("/subjects/{subject_id}", status_code=204)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.student_id == student.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()


@router.get("/subjects/{subject_id}/topics", response_model=list[TopicResponse])
def list_topics(
    subject_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.student_id == student.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject.topics


@router.post("/subjects/{subject_id}/topics", response_model=TopicResponse, status_code=201)
def create_topic(
    subject_id: int,
    data: TopicCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.student_id == student.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    topic = Topic(subject_id=subject_id, name=data.name)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@router.put("/topics/{topic_id}", response_model=TopicResponse)
def update_topic(
    topic_id: int,
    data: TopicUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    topic = db.query(Topic).filter(Topic.id == topic_id).join(Subject).filter(Subject.student_id == student.id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(topic, key, value)
    db.commit()
    db.refresh(topic)
    return topic


@router.delete("/topics/{topic_id}", status_code=204)
def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    topic = db.query(Topic).filter(Topic.id == topic_id).join(Subject).filter(Subject.student_id == student.id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic)
    db.commit()