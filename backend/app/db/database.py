import asyncpg

from app.core.config import settings

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    global _pool

    if _pool is None:
        _pool = await asyncpg.create_pool(dsn=settings.database_url)

    return _pool


async def close_pool() -> None:
    global _pool

    if _pool is not None:
        await _pool.close()
        _pool = None


async def save_message(session_id: str, role: str, content: str) -> None:
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
