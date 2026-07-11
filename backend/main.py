from fastapi import FastAPI

from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router
from app.api.v1.message import router as message_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)

from scalar_fastapi import get_scalar_api_reference

@app.get("/")
async def root():
    return {
        "message": "Chatbot Backend is Running"
    }

@app.get("/scalar", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )