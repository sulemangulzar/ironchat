from qdrant_client import AsyncQdrantClient
from qdrant_client.models import VectorParams, Distance
from app.core.config import settings

COLLECTION_NAME = settings.QDRANT_COLLECTION

qdrant_client = AsyncQdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY
)

async def init_qdrant():
    """Ensures the collection exists with the correct vector size for Voyage AI."""
    exists = await qdrant_client.collection_exists(COLLECTION_NAME)
    if not exists:
        # voyage-3-lite uses 512 dimensions
        await qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=512, distance=Distance.COSINE)
        )
        from qdrant_client.models import PayloadSchemaType
        await qdrant_client.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="chat_id",
            field_schema=PayloadSchemaType.KEYWORD
        )

