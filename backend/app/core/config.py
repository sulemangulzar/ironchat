import json

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GROQ_API_KEY: str
    ALLOWED_ORIGINS: str = "http://localhost:5173,https://ironchat-three.vercel.app"

    @property
    def allowed_origins(self) -> list[str]:
        origins_value = self.ALLOWED_ORIGINS.strip()

        if origins_value.startswith("["):
            origins = json.loads(origins_value)
        else:
            origins = origins_value.split(",")

        return [origin.strip().rstrip("/") for origin in origins if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()  # type: ignore
