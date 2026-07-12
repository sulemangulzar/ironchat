from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router
from app.api.v1.message import router as message_router
from app.api.v1.oauth import router as oauth_router
from app.core.config import settings


def parse_allowed_origins(origins: str) -> list[str]:
    return [origin.strip().strip('"').strip("'").rstrip('/') for origin in origins.split(',') if origin.strip()]


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_allowed_origins(settings.ALLOWED_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(oauth_router)


@app.get("/")
async def root():
    return {"message": "Chatbot Backend is Running"}


@app.get("/scalar", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )
