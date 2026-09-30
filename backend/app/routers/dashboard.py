from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.goal import Goal
from ..models.project import Project
from ..models.student import Student
from ..models.study_session import StudySession
from ..models.subject import Subject, Topic
from ..models.task import Task
from ..services.current_student import get_current_student

router = APIRouter()


@router.get("")
def get_dashboard(
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    today = date.today()

    # Tasks
    tasks_query = db.query(Task).filter(Task.student_id == student.id)
    due_today = tasks_query.filter(Task.status != "done", Task.due_date == today).all()
    overdue = tasks_query.filter(Task.status != "done", Task.due_date < today).all()
    upcoming = tasks_query.filter(Task.status != "done", Task.due_date > today).order_by(Task.due_date).all()
    completed_tasks = tasks_query.filter(Task.status == "done").count()
    pending_tasks = tasks_query.filter(Task.status != "done").count()

    # Goals
    active_goals = db.query(Goal).filter(Goal.student_id == student.id, Goal.status == "active").all()
    completed_goals = db.query(Goal).filter(Goal.student_id == student.id, Goal.status == "completed").count()

    # Study
    subjects = db.query(Subject).filter(Subject.student_id == student.id).all()
    total_topics = sum(len(s.topics) for s in subjects)
    done_topics = sum(sum(1 for t in s.topics if t.status == "done") for s in subjects)
    study_progress = round((done_topics / total_topics) * 100) if total_topics > 0 else 0

    week_ago = today - timedelta(days=7)
    week_minutes = (
        db.query(func.coalesce(func.sum(StudySession.duration_minutes), 0))
        .filter(StudySession.student_id == student.id, StudySession.session_date >= week_ago)
        .scalar()
    )

    next_exam = (
        db.query(Subject)
        .filter(Subject.student_id == student.id, Subject.exam_date >= today)
        .order_by(Subject.exam_date)
        .first()
    )

    # Projects
    active_projects = (
        db.query(Project)
        .filter(Project.student_id == student.id, Project.status.in_(["in_progress", "planning"]))
        .all()
    )
    completed_projects = (
        db.query(Project).filter(Project.student_id == student.id, Project.status == "completed").count()
    )

    # Skills
    from ..models.skill import StudentSkill
    skills = (
        db.query(StudentSkill)
        .filter(StudentSkill.student_id == student.id)
        .all()
    )

    return {
        "tasks": {
            "due_today": due_today,
            "overdue": overdue,
            "upcoming": upcoming,
            "completed_count": completed_tasks,
            "pending_count": pending_tasks,
        },
        "goals": {
            "active": active_goals,
            "completed_count": completed_goals,
        },
        "study": {
            "subjects": subjects,
            "total_topics": total_topics,
            "done_topics": done_topics,
            "progress": study_progress,
            "week_minutes": week_minutes,
            "next_exam": next_exam,
        },
        "projects": {
            "active": active_projects,
            "completed_count": completed_projects,
        },
        "skills": skills,
        "productivity": {
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "completed_goals": completed_goals,
            "study_minutes_this_week": week_minutes,
            "active_projects": len(active_projects),
            "completed_projects": completed_projects,
            "subject_progress": study_progress,
            "total_topics": total_topics,
            "done_topics": done_topics,
        },
    }