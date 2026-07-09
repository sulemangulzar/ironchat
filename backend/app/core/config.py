import json
from json import JSONDecodeError
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GROQ_API_KEY: str
    ALLOWED_ORIGINS: str = "http://localhost:5173,https://ironchat-three.vercel.app"
    DATABASE_URL: str = ""

    @property
    def database_url(self) -> str:
        database_url = self.DATABASE_URL.strip().strip('"').strip("'")

        if not database_url:
            raise RuntimeError("DATABASE_URL is not set. Add your Neon PostgreSQL URL in Render environment variables.")

        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)

        if database_url.startswith("postgresql+"):
            database_url = "postgresql://" + database_url.split("://", 1)[1]

        parts = urlsplit(database_url)
        query_params = [
            (key, value)
            for key, value in parse_qsl(parts.query, keep_blank_values=True)
            if key != "channel_binding"
        ]

        return urlunsplit((
            parts.scheme,
            parts.netloc,
            parts.path,
            urlencode(query_params),
            parts.fragment,
        ))

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
