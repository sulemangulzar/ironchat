import asyncpg

from app.core.config import settings

_pool: asyncpg.Pool | None = None
_schema_ready = False


async def get_pool() -> asyncpg.Pool:
    global _pool

    if _pool is None:
        _pool = await asyncpg.create_pool(dsn=settings.database_url)

    return _pool


async def close_pool() -> None:
    global _pool, _schema_ready

    if _pool is not None:
        await _pool.close()
        _pool = None
        _schema_ready = False


async def ensure_schema() -> None:
    global _schema_ready

    if _schema_ready:
        return

    pool = await get_pool()

    async with pool.acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """
                CREATE TABLE IF NOT EXISTS chat_sessions (
                    id TEXT PRIMARY KEY,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )

            await connection.execute(
                """
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id BIGSERIAL PRIMARY KEY,
                    session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
                    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
                    content TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )

            await connection.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created
                ON chat_messages(session_id, created_at);
                """
            )

    _schema_ready = True


async def save_message(session_id: str, role: str, content: str) -> None:
    await ensure_schema()
    pool = await get_pool()

    async with pool.acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """
                INSERT INTO chat_sessions (id)
                VALUES ($1)
                ON CONFLICT (id)
                DO UPDATE SET updated_at = NOW();
                """,
                session_id,
            )

            await connection.execute(
                """
                INSERT INTO chat_messages (session_id, role, content)
                VALUES ($1, $2, $3);
                """,
                session_id,
                role,
                content,
            )


async def get_recent_messages(session_id: str, limit: int) -> list[dict[str, str]]:
    await ensure_schema()
    pool = await get_pool()

    async with pool.acquire() as connection:
        rows = await connection.fetch(
            """
            SELECT role, content
            FROM chat_messages
            WHERE session_id = $1
            ORDER BY created_at DESC, id DESC
            LIMIT $2;
            """,
            session_id,
            limit,
        )

    return [
        {"role": row["role"], "content": row["content"]}
        for row in reversed(rows)
    ]
