import redis.asyncio as redis

from app.core.config import settings


class MemoryStore:
    def __init__(self):
        self.data = {}

    async def rpush(self, key: str, value: str):
        self.data.setdefault(key, []).append(value)

    async def lrange(self, key: str, start: int, end: int):
        values = self.data.get(key, [])

        if end == -1:
            end = len(values)
        else:
            end = end + 1

        return values[start:end]

    async def ltrim(self, key: str, start: int, end: int):
        values = self.data.get(key, [])

        if end == -1:
            end = len(values)
        else:
            end = end + 1

        self.data[key] = values[start:end]

    async def expire(self, key: str, seconds: int):
        return True


if settings.redis_url == "memory://":
    redis_db = MemoryStore()
else:
    redis_db = redis.from_url(settings.redis_url, decode_responses=True)
