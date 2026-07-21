from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    ALLOWED_ORIGINS: str = "*"
    DATABASE_URL: str = ""
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = ""
    FRONTEND_URL: str = "http://localhost:5173"
    APP_NAME: str = "IronChat"
    ALGORITHM: str = "HS256"
    SECRET_KEY: str = "secret-key-change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    TAVILY_API_KEY: str = ""

    # LLM Settings
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 1024
    LLM_TOP_P: float = 0.9

    QDRANT_API_KEY: str = ""
    QDRANT_URL: str = ""
    QDRANT_COLLECTION: str = "ironchat_docs"

    VOYAGE_API_KEY: str = ""

    SUPABASE_REST_URL: str = ""
    SUPABASE_BUCKET: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    @property
    def async_database_url(self) -> str:
        database_url = self.DATABASE_URL.strip().strip('"').strip("'")

        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)

        if database_url.startswith("postgresql://"):
            return database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

        return database_url

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
