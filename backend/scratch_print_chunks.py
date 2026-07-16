import json
def chunking(text, size=500, overlap=50):
    chunks = []
    start = 1
    while start < len(text):
        end  = start + size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk)
        start += size - overlap
    return chunks

with open("ironchat_info.txt", "r", encoding="utf-8") as f:
    text = f.read()

chunks = chunking(text)
for i, c in enumerate(chunks):
    print(f"[{i}] {c.strip()[:100]}...")
