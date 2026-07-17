import asyncio
import json
import logging
import numpy as np
from groq import AsyncGroq
from app.core.config import settings

def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    norm = np.linalg.norm(v1) * np.linalg.norm(v2)
    if norm == 0:
        return 0.0
    return float(np.dot(v1, v2) / norm)

async def evaluate_semantic_similarity(expected_answer: str, generated_answer: str) -> float:
    """Calculates cosine similarity between expected and generated answers using Voyage embeddings."""
    if not expected_answer or not generated_answer:
        return 0.0
        
    from app.core.voyage import embed_text
    
    vec_exp, vec_gen = await asyncio.gather(
        asyncio.to_thread(embed_text, expected_answer),
        asyncio.to_thread(embed_text, generated_answer)
    )
    return cosine_similarity(vec_exp, vec_gen)

class RAGMetricsJudge:
    def __init__(self):
        self.groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"

    async def _ask_judge(self, prompt: str) -> dict:
        """Helper to ask the LLM judge and parse JSON response."""
        try:
            resp = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )
            raw = resp.choices[0].message.content
            clean = raw.strip().strip("```json").strip("```").strip()
            return json.loads(clean)
        except Exception as e:
            logging.error(f"Judge failed: {e}")
            return {"score": 0, "reason": f"Judge error: {str(e)}"}

    async def evaluate_context_relevance(self, query: str, contexts: list[str]) -> dict:
        """Checks if the context contains the answer to the query."""
        context_str = "\n---\n".join(contexts) if contexts else "No context provided."
        prompt = f"""You are a strict judge evaluating the relevance of retrieved context for a given user query.
        
Query: {query}
Retrieved Context: 
{context_str}

Evaluate if the retrieved context contains sufficient information to answer the query.
Return ONLY valid JSON in this format:
{{"score": 1, "reason": "Context explicitly mentions X..."}} OR
{{"score": 0, "reason": "Context talks about Y but not X..."}}
"""
        return await self._ask_judge(prompt)

    async def evaluate_faithfulness(self, generated_answer: str, contexts: list[str]) -> dict:
        """Checks if the generated answer is grounded in the retrieved context using claim decomposition."""
        context_str = "\n---\n".join(contexts) if contexts else "No context provided."
        prompt = f"""You are a strict judge evaluating if an AI's generated answer is faithful to the provided context.
        
Generated Answer: {generated_answer}
Retrieved Context:
{context_str}

Step 1: Extract all factual claims from the Generated Answer.
Step 2: For each claim, check if it is explicitly supported by the Retrieved Context.
Step 3: If ALL claims are supported, score 1. If ANY claim is hallucinated or contradicts the context, score 0.
If the Generated Answer explicitly says "I don't know" or similar due to lack of context, score 1.

Return ONLY valid JSON in this format:
{{"score": 1, "reason": "All claims supported..."}} OR
{{"score": 0, "reason": "Claim X is not supported by context..."}}
"""
        return await self._ask_judge(prompt)

    async def evaluate_answer_relevance(self, query: str, generated_answer: str) -> dict:
        """Checks if the generated answer actually answers the user's query."""
        prompt = f"""You are a strict judge evaluating if an AI's generated answer addresses the user's query.
        
Query: {query}
Generated Answer: {generated_answer}

Does the generated answer directly address the core of the user's query? 
If the query asks for X and the answer says "I don't know X", that is relevant because it addresses the topic.
Return ONLY valid JSON in this format:
{{"score": 1, "reason": "Directly answers the query..."}} OR
{{"score": 0, "reason": "Answers a different question..."}}
"""
        return await self._ask_judge(prompt)
