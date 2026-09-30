from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.project import Project, ProjectTask
from ..models.student import Student
from ..schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate, ProjectTaskCreate, ProjectTaskResponse, ProjectTaskUpdate
from ..services.current_student import get_current_student

router = APIRouter()


def _project_to_response(project: Project) -> dict:
    total = len(project.tasks)
    done = sum(1 for t in project.tasks if t.done)
    progress = round((done / total) * 100) if total > 0 else 0
    return {
        "id": project.id,
        "student_id": project.student_id,
        "name": project.name,
        "description": project.description,
        "technology": project.technology,
        "status": project.status,
        "deadline": project.deadline,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "tasks": project.tasks,
        "progress": progress,
    }


@router.get("/projects", response_model=list[ProjectResponse])
def list_projects(
    status: str | None = None,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    query = db.query(Project).filter(Project.student_id == student.id)
    if status:
        query = query.filter(Project.status == status)
    projects = query.order_by(Project.created_at.desc()).all()
    return [_project_to_response(p) for p in projects]


@router.post("/projects", response_model=ProjectResponse, status_code=201)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    project = Project(student_id=student.id, **data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return _project_to_response(project)


@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    project = db.query(Project).filter(Project.id == project_id, Project.student_id == student.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return _project_to_response(project)


@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    project = db.query(Project).filter(Project.id == project_id, Project.student_id == student.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return _project_to_response(project)


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    project = db.query(Project).filter(Project.id == project_id, Project.student_id == student.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


@router.get("/projects/{project_id}/tasks", response_model=list[ProjectTaskResponse])
def list_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    project = db.query(Project).filter(Project.id == project_id, Project.student_id == student.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.tasks


@router.post("/projects/{project_id}/tasks", response_model=ProjectTaskResponse, status_code=201)
def create_project_task(
    project_id: int,
    data: ProjectTaskCreate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    project = db.query(Project).filter(Project.id == project_id, Project.student_id == student.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    task = ProjectTask(project_id=project_id, title=data.title)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/project-tasks/{task_id}", response_model=ProjectTaskResponse)
def update_project_task(
    task_id: int,
    data: ProjectTaskUpdate,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    task = (
        db.query(ProjectTask)
        .filter(ProjectTask.id == task_id)
        .join(Project)
        .filter(Project.student_id == student.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Project task not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/project-tasks/{task_id}", status_code=204)
def delete_project_task(
    task_id: int,
    db: Session = Depends(get_db),
    student: Student = Depends(get_current_student),
):
    task = (
        db.query(ProjectTask)
        .filter(ProjectTask.id == task_id)
        .join(Project)
        .filter(Project.student_id == student.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Project task not found")
    db.delete(task)
    db.commit()