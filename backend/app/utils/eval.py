import asyncio
import json
from pathlib import Path
from groq import AsyncGroq
from app.core.config import settings
from app.core.voyage import embed_text
from app.core.qdrant import qdrant_client
from app.services.message import RAG_SYSTEM_PROMPT

RAG_COLLECTION_NAME = "ironchat_docs"

def load_golden_set() -> list[dict]:
    file_path = Path(__file__).parent.parent.parent / "golden_set.json"
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

async def _run_rag_retrieval(question: str, top_k: int = 3) -> list[str]:
    try:
        # Note: We pass only the query string to the embedder, not the whole dict.
        question_vector = await asyncio.to_thread(embed_text, question)
        results = await qdrant_client.query_points(
            collection_name=RAG_COLLECTION_NAME,
            query=question_vector,
            limit=top_k,
        )
        chunks = [point.payload["text"] for point in results.points]
        return chunks
    except Exception as e:
        print(f"Retrieval error: {e}")
        return []

async def generate_rag_response(groq_client: AsyncGroq, question: str, retrieved_chunks: list[str]) -> str:
    if retrieved_chunks:
        context_block = "\n\n[DOCUMENT CONTEXT]\n" + "\n---\n".join(retrieved_chunks)
    else:
        context_block = "\n\n[DOCUMENT CONTEXT]\nNone"
        
    messages = [
        {"role": "system", "content": RAG_SYSTEM_PROMPT},
        {"role": "user", "content": f"{context_block}\n\nQuestion: {question}"}
    ]
    
    resp = await groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0,
    )
    return resp.choices[0].message.content

async def run_eval_pipeline():
    print("Starting Eval Pipeline...")
    golden_set = load_golden_set()
    groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    
    results = []
    
    for item in golden_set:
        query = item["query"]
        print(f"Evaluating [{item['id']}]: {query}")
        
        chunks = await _run_rag_retrieval(query)
        answer = await generate_rag_response(groq_client, query, chunks)
        
        result_item = {
            "id": item["id"],
            "query": query,
            "expected_answer": item.get("expected_answer"),
            "category": item.get("category"),
            "retrieved_context": chunks,
            "generated_answer": answer
        }
        results.append(result_item)
        
    out_path = Path(__file__).parent.parent.parent / "eval_results.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)
        
    print(f"Evaluation complete. Results saved to {out_path.name}")

if __name__ == "__main__":
    asyncio.run(run_eval_pipeline())
