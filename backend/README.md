# StudentOS AI — Backend

FastAPI + PostgreSQL backend for StudentOS AI.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```

4. Run migrations:
   ```bash
   alembic upgrade head
   ```

5. Seed development data:
   ```bash
   python seed.py
   ```

6. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Tests

```bash
cd backend
pytest
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings (env-based)
│   ├── database.py          # SQLAlchemy engine + session
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── routers/             # API route handlers
│   └── services/            # Business logic (current student)
├── migrations/              # Alembic migrations
├── tests/                   # Pytest test suite
├── seed.py                  # Development data seeder
├── requirements.txt
├── alembic.ini
└── .env.example
```