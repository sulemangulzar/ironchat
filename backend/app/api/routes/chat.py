from fastapi import APIRouter, HTTPException
from groq import Groq

from app.core.config import settings
from app.db.database import get_recent_messages, save_message
from app.schemas.chat import ChatRequest

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = {
    "role": "system",
    "content": "Be concise, technical, and precise.",
}
MAX_HISTORY_MESSAGES = 10


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        await save_message(request.session_id, "user", request.message)

        chat_history = await get_recent_messages(
            session_id=request.session_id,
            limit=MAX_HISTORY_MESSAGES,
        )
        full_payload = [SYSTEM_PROMPT] + chat_history

        chat_completion = client.chat.completions.create(
            messages=full_payload,  # type: ignore
            model="llama-3.1-8b-instant",
        )

        reply = chat_completion.choices[0].message.content or ""
        await save_message(request.session_id, "assistant", reply)

        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
