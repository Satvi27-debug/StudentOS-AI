from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.goal import Goal
from ..models.student import Student
from ..schemas.goal import GoalCreate, GoalResponse, GoalUpdate
from ..services.current_student import get_current_student

router = APIRouter()


@router.get("", response_model=list[GoalResponse])
def list_goals(
    status: str | None = None,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    query = db.query(Goal).filter(Goal.student_id == student.id)
    if status:
        query = query.filter(Goal.status == status)
    return query.order_by(Goal.created_at.desc()).all()


@router.post("", response_model=GoalResponse, status_code=201)
def create_goal(
    data: GoalCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    goal = Goal(student_id=student.id, **data.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.student_id == student.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    data: GoalUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.student_id == student.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, key, value)

    if data.status == "completed" and goal.completed_at is None:
        from datetime import datetime
        goal.completed_at = datetime.utcnow()
        goal.progress = 100
    elif data.status == "active":
        goal.completed_at = None

    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=204)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.student_id == student.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()