from typing import List
import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
from app.core.voyage import embed_text

def load_golden_set() -> list[dict]:
    file_path = Path(__file__).parent.parent.parent / "golden_set.json"
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

RAG_COLLECTION_NAME = "ironchat_docs"

load_json = load_golden_set()
print(load_json)
def queries(messages : List[str]):
    for query in load_json:
        print(query["id"])
        print(query["query"])
        convert_queires = embed_text(query)
        return convert_queires



converted = queries(load_json)
print(converted)
