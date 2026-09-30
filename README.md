# StudentOS AI

An AI-powered **student operating system**: one dashboard that brings together study, tasks, career, and an AI assistant that actually knows your context — and converts its plans into real tasks.

Built with **Next.js 16 + TypeScript + Tailwind CSS**.

---

## Current Stage: Level 1

**No AI. No database. No external APIs. No authentication.**

Everything runs locally using application state and structured seed data. The app persists to `localStorage` so your data survives a refresh.

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
- **Local Persistence** — all data saved to `localStorage`, survives refresh
- **Seed Data** — realistic starter data (Satvendra, B.Tech, AI/ML focus)

### Not Yet Implemented

- AI assistant (Level 2)
- Backend / database (Level 2)
- External datasets (Level 2)
- External APIs (Level 2)
- Authentication (Level 2)

---

## Running it

### 1. Install

```bash
npm install
```

### 2. Run

```bash
npm run dev
```

Open http://localhost:3000.

### 3. Reset to seed data

If you want to start fresh, open the browser console and run:

```js
localStorage.removeItem('studentos-state-v1')
location.reload()
```

---

## Architecture

```
src/
├─ app/                    # Next.js App Router
│  ├─ (dashboard, study, tasks, goals, projects, skills, career, profile, productivity, assistant, …)
│  └─ api/assistant/       # NDJSON streaming chat endpoint (Level 2)
├─ lib/
│  ├─ local/               # Level 1 local data layer
│  │  ├─ types.ts          # TypeScript interfaces
│  │  ├─ seed.ts           # Realistic starter data
│  │  ├─ storage.ts        # localStorage abstraction
│  │  ├─ store.tsx         # Central state (React Context + useReducer)
│  │  └─ selectors.ts      # Derived calculations
│  ├─ mastra/              # AI agents (Level 2)
│  ├─ db/                  # Drizzle schema + queries (Level 2)
│  └─ ...
├─ components/             # UI components
└─ ...
```

### Data flow (Level 1)

```
UI Components
    ↓
useStudent() / useStudentActions()
    ↓
StudentProvider (React Context + useReducer)
    ↓
localStorage (persistence)
```

### Future architecture

```
LEVEL 2:  UI → Application Services → Backend → Database
LEVEL 3:  StudentOS → AI Orchestrator → Study/Coding/Career/Research/Project AI
```

---

## Project Structure

| Area | Status |
| --- | --- |
| **Dashboard** | ✅ Level 1 |
| **Tasks** | ✅ Level 1 |
| **Goals** | ✅ Level 1 |
| **Study** | ✅ Level 1 |
| **Study Sessions** | ✅ Level 1 |
| **Projects** | ✅ Level 1 |
| **Skills** | ✅ Level 1 |
| **Career Profile** | ✅ Level 1 |
| **Productivity** | ✅ Level 1 |
| **AI Assistant** | 🔜 Level 2 |
| **Coding Agent** | 🔜 Level 2 |
| **Projects Agent** | 🔜 Level 2 |
| **Opportunities Agent** | 🔜 Level 2 |
| **Research Agent** | 🔜 Level 2 |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: React Context + useReducer
- **Persistence**: localStorage
- **AI**: Mastra + Gemini (Level 2)
- **Database**: PostgreSQL + Drizzle (Level 2)
- **Auth**: Clerk (Level 2)