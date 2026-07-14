from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router
from app.api.v1.message import router as message_router
from app.api.v1.oauth import router as oauth_router
from app.api.v1.web_search import router as web_search_router
from app.core.config import settings
from app.core.database import engine


def parse_allowed_origins(origins: str) -> list[str]:
    return [origin.strip().strip('"').strip("'").rstrip('/') for origin in origins.split(',') if origin.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up the DB connection pool so the first real request is fast
    async with engine.connect() as conn:
        await conn.execute(__import__('sqlalchemy').text('SELECT 1'))
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

import time
from fastapi import Request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_allowed_origins(settings.ALLOWED_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"Endpoint {request.method} {request.url.path} took {process_time:.4f} seconds")
    return response

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(oauth_router)
app.include_router(web_search_router)


@app.get("/")
async def root():
    return {"message": "Chatbot Backend is Running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/scalar", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )
