from contextlib import asynccontextmanager
import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router
from app.api.v1.file_uploads import router as file_upload_router
from app.api.v1.message import router as message_router
from app.api.v1.oauth import router as oauth_router
from app.api.v1.web_search import router as web_search_router
from app.core.config import settings
from app.core.database import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def parse_allowed_origins(origins_str: str = "") -> list[str]:
    origins = {
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    }
    for source in [origins_str, settings.ALLOWED_ORIGINS, settings.FRONTEND_URL]:
        if source:
            for origin in source.split(','):
                cleaned = origin.strip().strip('"').strip("'").rstrip('/')
                if cleaned and cleaned != "*":
                    origins.add(cleaned)
    return list(origins)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up the DB connection pool so the first real request is fast
    try:
        async with engine.connect() as conn:
            await conn.execute(__import__('sqlalchemy').text('SELECT 1'))
    except Exception as e:
        print(f"Lifespan DB connection warning: {e}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# CORSMiddleware must be added BEFORE custom http middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_allowed_origins(settings.ALLOWED_ORIGINS),
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
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


from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception on {request.url.path}: {exc}", exc_info=True)
    origin = request.headers.get("origin", "*")
    response = JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
    )
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc}")
    origin = request.headers.get("origin", "*")
    response = JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response



app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(oauth_router)
app.include_router(web_search_router)
app.include_router(file_upload_router)


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

