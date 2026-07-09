import json
from json import JSONDecodeError

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GROQ_API_KEY: str
    ALLOWED_ORIGINS: str = "http://localhost:5173,https://ironchat-three.vercel.app"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ironchat"

    @property
    def database_url(self) -> str:
        database_url = self.DATABASE_URL.strip().strip('"').strip("'")

        if database_url.startswith("postgres://"):
            return database_url.replace("postgres://", "postgresql://", 1)

        return database_url

    @property
    def allowed_origins(self) -> list[str]:
        origins_value = self.ALLOWED_ORIGINS.strip()

        if origins_value.startswith("[") and origins_value.endswith("]"):
            try:
                origins = json.loads(origins_value)
            except JSONDecodeError:
                origins = origins_value.strip("[]").split(",")
        else:
            origins = origins_value.split(",")

        return [
            origin.strip().strip('"').strip("'").rstrip("/")
            for origin in origins
            if origin.strip()
        ]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()  # type: ignore
