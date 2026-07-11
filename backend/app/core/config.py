from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY : str
    ALLOWED_ORIGINS : str 
    DATABASE_URL : str
    CLIENT_ID : str
    CLIENT_SECRET : str
    REDIRECT_URI : str
    APP_NAME : str = "IronChat"
    ALGORITHM : str 
    SECRET_KEY : str
    ACCESS_TOKEN_EXPIRE_MINUTES : int
    REFRESH_TOKEN_EXPIRE_DAYS : int
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()