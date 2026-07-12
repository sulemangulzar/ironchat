from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY : str
    ALLOWED_ORIGINS : str
    DATABASE_URL : str
    CLIENT_ID : str = ""
    CLIENT_SECRET : str = ""
    REDIRECT_URI : str = ""
    GOOGLE_CLIENT_ID : str = ""
    GOOGLE_CLIENT_SECRET : str = ""
    GOOGLE_REDIRECT_URI : str = ""
    FRONTEND_URL : str = "http://localhost:5173"
    APP_NAME : str = "IronChat"
    ALGORITHM : str
    SECRET_KEY : str
    ACCESS_TOKEN_EXPIRE_MINUTES : int
    REFRESH_TOKEN_EXPIRE_DAYS : int
    
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