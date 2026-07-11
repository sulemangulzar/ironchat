from app.core.config import settings
from collections.abc import AsyncIterable
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession


engine = create_async_engine(
    settings.async_database_url,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
    connect_args={"ssl": "require", "server_settings": {"jit": "off"}, "statement_cache_size": 0},
)

SessionFactory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)

async def get_session() -> AsyncIterable[AsyncSession]:
    async with SessionFactory() as session:
        yield session
