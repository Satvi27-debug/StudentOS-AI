# StudentOS AI

An AI-powered **student operating system**: one dashboard that brings together study, tasks, career, and an AI assistant that actually knows your context — and converts its plans into real tasks.

Built with **Next.js 16 + TypeScript + Tailwind CSS + FastAPI + PostgreSQL**.

---

## Current Stage: Level 2

**Backend + Database.** The app now stores all student data in PostgreSQL through a FastAPI backend. No AI yet — that comes in Level 3.

### Implemented

- **Dashboard** — today's tasks, upcoming deadlines, study progress, active goals, quick stats
- **Tasks** — full CRUD, priority, category, due date, filter, sort
- **Goals** — create, edit, delete, complete, track progress, target dates
- **Study** — subjects, topics, exam dates, auto-calculated progress
- **Study Sessions** — log sessions with subject, topic, duration, date, notes; view stats
- **Projects** — create projects with status, deadline, tasks; progress from tasks
- **Skills** — add/edit/remove skills with proficiency levels
- **Career Profile** — target role, interests, skills, projects
- **Productivity Overview** — completed/pending tasks, goals, study hours, project stats
- **Backend API** — FastAPI with REST endpoints for all entities
- **Database** — PostgreSQL with SQLAlchemy ORM + Alembic migrations
- **Seed Data** — realistic starter data (Satvendra, B.Tech, AI/ML focus)

### Not Yet Implemented

- AI assistant (Level 3)
- External datasets (Level 4)
- External APIs (Level 4)
- Authentication (Level 3/4)

---

## Running the Project

### 1. Clone and install frontend

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Set up the backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

### 4. Run migrations

```bash
cd backend
alembic upgrade head
```

### 5. Seed development data

```bash
cd backend
python seed.py
```

### 6. Start the backend

```bash
cd backend
uvicorn app.main:app --reload
```

The API runs at http://localhost:8000. Visit http://localhost:8000/docs for interactive API documentation.

### 7. Start the frontend

```bash
npm run dev
```

Open http://localhost:3000.

---

## Architecture

```
Frontend (Next.js)
    ↓
API Service Layer (src/lib/api/)
    ↓
FastAPI Backend (backend/)
    ↓
PostgreSQL
```

### Data flow

```
UI Components
    ↓
useStudent() / useStudentActions()
    ↓
API Client (src/lib/api/client.ts)
    ↓
FastAPI REST API
    ↓
PostgreSQL
```

---

## Project Structure

```
├── src/                       # Frontend (Next.js)
│   ├── app/                   # Pages
│   ├── components/            # UI components
│   ├── lib/
│   │   ├── api/               # API client + service functions
│   │   └── local/             # Local state (Level 1, now uses API)
│   └── ...
├── backend/                   # Backend (FastAPI)
│   ├── app/
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── config.py          # Settings
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   ├── models/            # ORM models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── routers/           # API routes
│   │   └── services/          # Business logic
│   ├── migrations/            # Alembic migrations
│   ├── tests/                 # Pytest test suite
│   ├── seed.py                # Development data seeder
│   ├── requirements.txt
│   └── .env.example
├── docker-compose.yml         # PostgreSQL
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | List tasks (filter, sort) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/{id}` | Get task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| GET | `/api/goals` | List goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/{id}` | Update goal |
| DELETE | `/api/goals/{id}` | Delete goal |
| GET | `/api/subjects` | List subjects |
| POST | `/api/subjects` | Create subject |
| GET | `/api/subjects/{id}/topics` | List topics |
| POST | `/api/subjects/{id}/topics` | Create topic |
| GET | `/api/study-sessions` | List sessions |
| POST | `/api/study-sessions` | Create session |
| GET | `/api/study-sessions/stats` | Study statistics |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/{id}/tasks` | List project tasks |
| POST | `/api/projects/{id}/tasks` | Create project task |
| GET | `/api/skills` | List skills |
| POST | `/api/skills` | Create skill |
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |
| GET | `/api/dashboard` | Aggregated dashboard data |

---

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4
- **Backend**: FastAPI, SQLAlchemy 2.0, Alembic
- **Database**: PostgreSQL 16
- **State**: React Context + API service layer
- **Testing**: Pytest (backend), ESLint (frontend)