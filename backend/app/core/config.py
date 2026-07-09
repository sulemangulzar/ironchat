from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY : str
    ALLOWED_ORIGINS : List[str]
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings() #type: ignore
