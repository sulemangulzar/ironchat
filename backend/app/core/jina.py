from typing import List
from langchain_community.embeddings import JinaEmbeddings
from app.core.config import settings

_embeddings_client: JinaEmbeddings | None = None


def get_jina_embeddings() -> JinaEmbeddings:
    global _embeddings_client
    if _embeddings_client is None:
        _embeddings_client = JinaEmbeddings(
            jina_api_key=settings.JINA_API_KEY,
            model_name="jina-embeddings-v2-base-en",
        )
    return _embeddings_client


def embed_text(text: str) -> List[float]:
    """Embeds a single query string using Jina Embeddings."""
    client = get_jina_embeddings()
    return client.embed_query(text)


def embed_documents(texts: List[str]) -> List[List[float]]:
    """Embeds multiple document chunks using Jina Embeddings."""
    client = get_jina_embeddings()
    return client.embed_documents(texts)
