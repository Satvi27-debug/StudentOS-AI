from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.student import Student
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskResponse, TaskUpdate
from ..services.current_student import get_current_student

router = APIRouter()


@router.get("", response_model=list[TaskResponse])
def list_tasks(
    status: str | None = Query(None, pattern="^(todo|done)$"),
    priority: str | None = Query(None, pattern="^(low|medium|high)$"),
    category: str | None = Query(None),
    sort: str = Query("due_date", pattern="^(due_date|priority|category|title)$"),
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    query = db.query(Task).filter(Task.student_id == student.id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if category:
        query = query.filter(Task.category == category)

    if sort == "due_date":
        query = query.order_by(Task.due_date.asc().nullslast())
    elif sort == "priority":
        query = query.order_by(Task.priority)
    elif sort == "category":
        query = query.order_by(Task.category)
    elif sort == "title":
        query = query.order_by(Task.title)

    return query.all()


@router.post("", response_model=TaskResponse, status_code=201)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    task = Task(student_id=student.id, **data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    task = db.query(Task).filter(Task.id == task_id, Task.student_id == student.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    task = db.query(Task).filter(Task.id == task_id, Task.student_id == student.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    if data.status == "done" and task.completed_at is None:
        from datetime import datetime
        task.completed_at = datetime.utcnow()
    elif data.status == "todo":
        task.completed_at = None

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    task = db.query(Task).filter(Task.id == task_id, Task.student_id == student.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()