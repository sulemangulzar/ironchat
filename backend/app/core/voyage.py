# import voyageai
# from app.core.config import settings

# voyage_client = voyageai.AsyncClient(api_key=settings.VOYAGE_API_KEY)

from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")   



def embed_text(text : str):
    question_vector = model.encode(text).tolist()
    return question_vector