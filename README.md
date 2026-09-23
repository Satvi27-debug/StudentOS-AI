# StudentOS AI

An AI-powered **student operating system**: one dashboard that brings together study, tasks, career, and an AI assistant that actually knows your context — and converts its plans into real tasks.

Built with **Next.js 16 + TypeScript + Mastra + Gemini + PostgreSQL (+ optional Clerk)**.

---

## What's in the MVP

| Area | Status |
| --- | --- |
| **Dashboard** | Today's tasks, next exam, career goal, quick-ask box |
| **AI Assistant** | Supervisor routes requests to specialized agents; streams answers live |
| **Study** | Subjects, syllabus topics, exam dates, topic progress |
| **Tasks** | One unified list — your own to-dos plus AI-created tasks |
| **Career** | Target role, skills, interests in your profile |
| **Profile** | Single student profile that grounds every agent |
| **Coding / Projects / Opportunities / Research** | Placeholder pages (later milestones) |

### How the assistant works

1. Your request plus your real student context (profile, subjects, open tasks) goes to the **Supervisor**.
2. The Supervisor picks the best-fit agent: **Study**, **Productivity**, **Career**, or General.
3. The chosen agent streams an answer back. When a plan emerges, it can call the **`create_tasks`** tool to turn it into real entries in your Tasks list — no copy-pasting.

The system never fabricates data: if Gemini isn't configured, the database is empty, or something fails to load, it says so explicitly.

---

## Running it

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in what you have. The app **degrades gracefully** — it runs with nothing set (local mode, setup notice on the dashboard).

| Variable | Required for | Notes |
| --- | --- | --- |
| `GOOGLE_API_KEY` | AI Assistant | Get one at https://aistudio.google.com/apikey |
| `GEMINI_MODEL` | (optional) | Default `google/gemini-2.5-flash` |
| `DATABASE_URL` | Profile / Study / Tasks | Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | (optional) | Without them the app runs as single-user `local` mode |

### 3. Start the database

```bash
docker compose up -d     # local Postgres (matches .env defaults)
npm run db:push          # create/update tables
```

(Or point `DATABASE_URL` at any existing Postgres and run `npm run db:push`.)

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

### Useful commands

```bash
npm run db:studio   # browse the database in Drizzle Studio
npm run lint        # eslint
npm run build       # production build + type check
npm run db:setup    # convenience: db:up + db:push
```

---

## Architecture

```
src/
├─ app/                    # Next.js App Router
│  ├─ (dashboard, study, tasks, career, profile, assistant, …)
│  └─ api/assistant/       # NDJSON streaming chat endpoint
├─ mastra/
│  ├─ agents/              # Supervisor + Study / Productivity / Career agents
│  ├─ tools/create-tasks   # AI → action: turns plans into real tasks
│  ├─ routing.ts           # structured-output router (study/productivity/career/general)
│  └─ context.ts           # builds the student context block from DB data
├─ db/                     # Drizzle schema + query layer (never throws)
├─ actions/                # Server Actions for data mutations
├─ lib/                    # auth, date helpers, AsyncLocalStorage user context
└─ components/             # restrained zinc/blue UI kit
```

- **Single database, no extra infra.** No vector store, no queue, no microservices. One Postgres with `profiles`, `subjects`, `topics`, `tasks`.
- **AI → action.** The `create_tasks` tool receives user id via `AsyncLocalStorage`, so agents can safely write tasks for the signed-in (or local) student.
- **Optional auth.** Clerk keys present → real sign-in and per-user data. Absent → single-user `local` mode.
- **Honest by default.** Every page and agent path degrades to a clear "not configured / missing data" message instead of inventing content.

## Roadmap

Later milestones (stubs already in the nav):

- **Coding agent** — practice problems, language/skill plans tied to the profile
- **Projects agent** — portfolio planning, repo scaffolding, milestone tracking
- **Opportunities agent** — internships, placement drives, deadlines
- **Research agent** — papers, literature review, seminar prep
- **Resume agent** — profile-grounded resume and interview prep
- Rich content (notes, revision cards) and study scheduling with procrastination-aware planning