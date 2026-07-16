import logging
import asyncio
import json
import math
import nest_asyncio
import re
from rank_bm25 import BM25Okapi
from sentence_transformers import CrossEncoder
from groq import AsyncGroq
from app.core.qdrant import qdrant_client
from app.core.voyage import embed_text
from app.core.config import settings

def load_golden_set() -> list[dict]:
    with open("golden_set.json", "r", encoding="utf-8") as file:
        return json.load(file)

RAG_COLLECTION_NAME = "ironchat_docs"

# Initialize Advanced RAG components
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def tokenize(text: str) -> list[str]:
    return text.lower().split()

def build_bm25(points):
    texts = [
        point.payload.get("text", "")
        for point in points
    ]
    tokenized_corpus = [
        tokenize(text)
        for text in texts
    ]
    bm25 = BM25Okapi(tokenized_corpus)
    return bm25, texts

async def load_all_chunks() -> list:
    all_points = []
    offset = None

    while True:
        points, next_offset = await qdrant_client.scroll(
            collection_name=RAG_COLLECTION_NAME,
            limit=100,
            offset=offset,
            with_payload=True,
            with_vectors=False,
        )

        all_points.extend(points)

        if next_offset is None:
            break

        offset = next_offset

    return all_points

async def _rewrite_query(query: str) -> list[str]:
    """Uses Groq to generate 3 semantic variations of the query."""
    prompt = f"""You are an AI search assistant. Your task is to generate 2 distinct, 
semantic variations of the following user query to improve search retrieval.
Return ONLY the variations, separated by newlines. No numbers, bullets, or extra text.

Original Query: {query}"""
    try:
        response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        variations = response.choices[0].message.content.strip().split('\n')
        # Clean up any bullets if the LLM hallucinated them
        variations = [re.sub(r'^\d+\.\s*|^- \s*|^\* \s*', '', v).strip() for v in variations if v.strip()]
        return [query] + variations[:2] # Always include original
    except Exception as e:
        logging.error(f"Query rewrite failed: {e}")
        return [query]

async def _run_rag_retrieval(query: str, top_k: int = 3) -> list:
    """
    Advanced RAG: Rewrites query, fetches Top-10 for each variation, deduplicates, 
    and then re-ranks using a Cross-Encoder to return the true Top-K.
    """
    try:
        queries = await _rewrite_query(query)
        print(f"  [Rewritten Queries]: {queries}")
        
        all_points = []
        # 1. WIDE NET: Fetch Top-10 for each variation
        for q in queries:
            q_vector = await asyncio.to_thread(embed_text, q)
            results = await qdrant_client.query_points(
                collection_name=RAG_COLLECTION_NAME,
                query=q_vector,
                limit=10,
            )
            all_points.extend(results.points)
            
        # 2. DEDUPLICATE chunks by ID
        unique_points = {}
        for p in all_points:
            if p.id not in unique_points:
                unique_points[p.id] = p
        candidate_points = list(unique_points.values())
        
        # 3. NARROW NET: Cross-Encoder Reranking
        pairs = [[query, p.payload["text"]] for p in candidate_points]
        scores = cross_encoder.predict(pairs)
        
        # Attach scores via tuple since ScoredPoint is frozen/strict
        scored_candidates = list(zip(candidate_points, scores))
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        
        # Return the ultimate Top-K points (without the score tuple wrapper)
        return [p for p, s in scored_candidates][:top_k]

    except Exception as e:
        logging.error(f"Advanced RAG retrieval failed: {e}")
        return []

async def main():
    golden_set = load_golden_set()
    
    all_chunks = await load_all_chunks()
    bm25, texts = build_bm25(all_chunks)
    print("BM25 index created.")
    print("Documents indexed:", len(texts))
    
    total_queries = 0
    sum_precision = 0.0
    sum_recall = 0.0
    sum_rr = 0.0
    sum_ndcg = 0.0

    print(f"Running Baseline Evaluation on {len(golden_set)} queries...\n")

    for item in golden_set:
        query = item["query"]
        relevant_ids = set(item.get("relevant_chunk_ids", []))
        
        # Skip queries where ground truth hasn't been labeled yet
        if not relevant_ids:
            continue
            
        points = await _run_rag_retrieval(query)
        retrieved_ids = [point.id for point in points]
        
        relevant_retrieved = sum(1 for chunk_id in retrieved_ids if chunk_id in relevant_ids)
         
        precision_at_k = relevant_retrieved / len(retrieved_ids) if retrieved_ids else 0.0
        recall_at_k = relevant_retrieved / len(relevant_ids) if relevant_ids else 0.0
        
        reciprocal_rank = 0.0
        for rank, chunk_id in enumerate(retrieved_ids, start=1):
            if chunk_id in relevant_ids:
                reciprocal_rank = 1 / rank
                break
                
        dcg = sum((1 if chunk_id in relevant_ids else 0) / math.log2(rank + 1) for rank, chunk_id in enumerate(retrieved_ids, start=1))
        ideal_relevant_count = min(len(relevant_ids), len(retrieved_ids))
        idcg = sum(1 / math.log2(rank + 1) for rank in range(1, ideal_relevant_count + 1))
        ndcg_at_k = dcg / idcg if idcg > 0 else 0.0

        total_queries += 1
        sum_precision += precision_at_k
        sum_recall += recall_at_k
        sum_rr += reciprocal_rank
        sum_ndcg += ndcg_at_k

        all_chunks = await load_all_chunks()

    print("Total chunks loaded:", len(all_chunks))

    for point in all_chunks[:3]:
         print(point.id, point.payload["text"][:100])

    if total_queries == 0:
        print("No queries with 'relevant_chunk_ids' found in golden_set.json.")
        print("Please add 'relevant_chunk_ids' (ground truth) to your JSON file to run the evaluation.")
        return

    print("=== BASELINE RESULTS ===")
    print(f"Total Valid Queries: {total_queries}")
    print(f"Mean Precision@3:    {sum_precision / total_queries:.4f}")
    print(f"Mean Recall@3:       {sum_recall / total_queries:.4f}")
    print(f"Mean Reciprocal Rank:{sum_rr / total_queries:.4f} (MRR)")
    print(f"Mean nDCG@3:         {sum_ndcg / total_queries:.4f}")

if __name__ == "__main__":
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():

        nest_asyncio.apply()
        asyncio.run(main())

    else:
        asyncio.run(main())
