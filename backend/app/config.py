from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://studentos:studentos@localhost:5432/studentos"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    DEV_STUDENT_ID: int = 1

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()