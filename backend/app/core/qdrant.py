from qdrant_client import AsyncQdrantClient
from qdrant_client.models import VectorParams, Distance
from app.core.config import settings

COLLECTION_NAME = settings.QDRANT_COLLECTION

qdrant_client = AsyncQdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY
)


