import asyncio
import json
from pathlib import Path

from app.utils.metrics import RAGMetricsJudge, evaluate_semantic_similarity

async def generate_report():
    print("Generating Debugging Matrix Report...\n")
    results_path = Path(__file__).parent.parent.parent / "eval_results.json"
    
    if not results_path.exists():
        print(f"Error: {results_path} not found. Run eval.py first.")
        return
        
    with open(results_path, "r", encoding="utf-8") as f:
        results = json.load(f)
        
    judge = RAGMetricsJudge()
    
    matrix = []
    
    # Process sequentially to not overload the API
    for item in results:
        qid = item["id"]
        q = item["query"]
        expected = item.get("expected_answer", "")
        generated = item.get("generated_answer", "")
        contexts = item.get("retrieved_context", [])
        category = item.get("category", "standard")
        
        print(f"Evaluating Q{qid}: {q[:40]}...")
        
        # 1. Semantic Similarity
        sim_score = await evaluate_semantic_similarity(expected, generated)
        
        # 2. Context Relevance
        c_rel = await judge.evaluate_context_relevance(q, contexts)
        c_score = c_rel.get("score", 0)
        
        # 3. Faithfulness
        f_rel = await judge.evaluate_faithfulness(generated, contexts)
        f_score = f_rel.get("score", 0)
        
        # 4. Answer Relevance
        a_rel = await judge.evaluate_answer_relevance(q, generated)
        a_score = a_rel.get("score", 0)
        
        # Guardrail check
        guardrail_passed = "N/A"
        if category == "guardrail_idk":
            guardrail_passed = "PASS" if f_score == 1 and a_score == 1 else "FAIL"
            
        matrix.append({
            "ID": qid,
            "Semantic": f"{sim_score:.2f}",
            "Ctx": c_score,
            "Faith": f_score,
            "Ans": a_score,
            "Guardrail": guardrail_passed
        })
        
    print("\n" + "="*80)
    print(" "*25 + "RAG DEBUGGING MATRIX")
    print("="*80)
    print(f"{'ID':<5} | {'Semantic':<10} | {'Context Rel':<12} | {'Faithful':<10} | {'Answer Rel':<12} | {'Guardrail'}")
    print("-" * 80)
    for row in matrix:
        print(f"{row['ID']:<5} | {row['Semantic']:<10} | {row['Ctx']:<12} | {row['Faith']:<10} | {row['Ans']:<12} | {row['Guardrail']}")
    print("="*80)

if __name__ == "__main__":
    asyncio.run(generate_report())
