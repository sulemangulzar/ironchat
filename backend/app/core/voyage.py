import voyageai
from app.core.config import settings

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = voyageai.Client(api_key=settings.VOYAGE_API_KEY)
    return _client

def embed_text(text: str) -> list[float]:
    client = _get_client()
    result = client.embed([text], model="voyage-3-lite", input_type="query")
    return result.embeddings[0]