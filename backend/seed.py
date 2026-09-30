"""Seed the database with realistic development data.

Usage:
    cd backend
    python seed.py
"""

from datetime import date, datetime, timedelta

from app.database import SessionLocal
from app.models import (
    CareerProfile,
    Goal,
    Project,
    ProjectTask,
    Skill,
    Student,
    StudentSkill,
    StudySession,
    Subject,
    Task,
    Topic,
)


def seed():
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(ProjectTask).delete()
        db.query(Project).delete()
        db.query(StudySession).delete()
        db.query(Topic).delete()
        db.query(Subject).delete()
        db.query(StudentSkill).delete()
        db.query(Skill).delete()
        db.query(Goal).delete()
        db.query(Task).delete()
        db.query(CareerProfile).delete()
        db.query(Student).delete()
        db.commit()

        # Student
        student = Student(id=1, name="Satvendra", email="satvendra@studentos.dev")
        db.add(student)
        db.commit()

        # Career profile
        career = CareerProfile(
            student_id=1,
            target_role="Machine Learning Engineer",
            interests="AI/ML,Web Development,System Design",
        )
        db.add(career)

        # Tasks
        today = date.today()
        tasks = [
            Task(student_id=1, title="Complete DBMS assignment", category="study", priority="high", due_date=today),
            Task(student_id=1, title="Practice 3 DSA problems", category="coding", priority="medium", due_date=today),
            Task(student_id=1, title="Review Machine Learning notes", category="study", priority="medium", due_date=today),
            Task(student_id=1, title="Build dashboard UI", category="project", priority="high", status="done", completed_at=datetime.utcnow()),
        ]
        db.add_all(tasks)

        # Goals
        goals = [
            Goal(student_id=1, title="Complete DSA preparation", category="coding", target_date=today + timedelta(days=77), progress=42),
            Goal(student_id=1, title="Build 3 portfolio projects", category="project", target_date=today + timedelta(days=61), progress=67),
        ]
        db.add_all(goals)

        # Subjects + Topics
        subjects_data = [
            ("Data Structures", None, [("Arrays & Strings", "done"), ("Linked Lists", "done"), ("Trees", "in_progress"), ("Graphs", "todo"), ("Dynamic Programming", "todo")]),
            ("Database Management Systems", today + timedelta(days=15), [("SQL", "done"), ("Normalization", "done"), ("Transactions", "in_progress"), ("Indexing", "todo")]),
            ("Operating Systems", None, [("Processes", "done"), ("Threads", "in_progress"), ("Scheduling", "todo"), ("Memory Management", "todo")]),
            ("Machine Learning", None, [("Linear Regression", "done"), ("Classification", "in_progress"), ("Neural Networks", "todo")]),
            ("Computer Networks", None, [("OSI Model", "done"), ("TCP/IP", "in_progress"), ("Routing", "todo")]),
        ]
        subject_map = {}
        for name, exam_date, topics in subjects_data:
            subject = Subject(student_id=1, name=name, exam_date=exam_date)
            db.add(subject)
            db.commit()
            subject_map[name] = subject.id
            for topic_name, status in topics:
                db.add(Topic(subject_id=subject.id, name=topic_name, status=status))
        db.commit()

        # Study sessions
        sessions = [
            StudySession(student_id=1, subject_id=subject_map["Database Management Systems"], duration_minutes=45, session_date=today, notes="Practiced normalization problems"),
            StudySession(student_id=1, subject_id=subject_map["Data Structures"], duration_minutes=60, session_date=today, notes="Tree traversals"),
        ]
        db.add_all(sessions)

        # Projects + tasks
        projects_data = [
            ("StudentOS AI", "AI-powered student operating system", "Next.js, TypeScript", "in_progress", today + timedelta(days=32), [("Build dashboard", True), ("Create task system", True), ("Design data model", False), ("Implement AI assistant", False)]),
            ("Green City AI", "Smart city sustainability platform", "React, Python", "planning", None, [("Research phase", False), ("Data collection", False)]),
            ("Smart Hire", "AI-powered recruitment platform", "Next.js, PostgreSQL", "completed", None, [("Frontend", True), ("Backend", True)]),
        ]
        for name, desc, tech, status, deadline, tasks in projects_data:
            project = Project(student_id=1, name=name, description=desc, technology=tech, status=status, deadline=deadline)
            db.add(project)
            db.commit()
            for task_title, done in tasks:
                db.add(ProjectTask(project_id=project.id, title=task_title, done=done))
        db.commit()

        # Skills
        skills_data = [("Python", "intermediate"), ("Machine Learning", "intermediate"), ("Git", "advanced"), ("SQL", "intermediate"), ("React", "beginner")]
        for skill_name, level in skills_data:
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.add(skill)
                db.commit()
            db.add(StudentSkill(student_id=1, skill_id=skill.id, level=level))
        db.commit()

        print("Database seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()