import json
from fastapi import APIRouter, HTTPException
from groq import Groq
from app.db.redis import redis_db
from app.core.config import settings
from app.schemas.chat import ChatRequest

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)




SYSTEM_PROMPT = {
    "role": "system",
    "content": "Be concise, technical, and precise."
}
MAX_HISTORY_MESSAGES = 10

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        redis_key = f"session:{request.session_id}"


        user_msg = {"role": "user", "content": request.message}
        await redis_db.rpush(redis_key, json.dumps(user_msg))


        raw_history = await redis_db.lrange(redis_key, 0, -1)
        chat_history = [json.loads(msg) for msg in raw_history]

        full_payload = [SYSTEM_PROMPT] + chat_history

        chat_completion = client.chat.completions.create(
            messages=full_payload, # type: ignore
            model="llama-3.1-8b-instant",
        )

        reply = chat_completion.choices[0].message.content

        assistant_msg = {"role": "assistant", "content": reply}
        await redis_db.rpush(redis_key, json.dumps(assistant_msg))

        await redis_db.ltrim(redis_key, -MAX_HISTORY_MESSAGES, -1)

        await redis_db.expire(redis_key, 86400)

        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
