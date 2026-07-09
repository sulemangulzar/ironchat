from groq import Groq
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.chat import ChatRequest


router = APIRouter()

client = Groq(api_key=settings.GROQ_API_KEY)


@router.post("/chat")
async def chat(request : ChatRequest):
    try:
        chat_completion = client.chat.completions.create(messages=[
                        {
                            "role": "system",
                            "content": "You are an expert systems architect and coding mentor. Your goal is to help the user build robust, high-performance applications. Explain the underlying architecture, encourage reverse engineering, and break down complex concepts into logical, step-by-step implementations. Be concise, technical, and precise."
                        },
                        {
                            "role": "user",
                            "content": request.message
                        }
                    ],
                    model="llama-3.1-8b-instant", # A highly permissive, fast model for prototyping
                )

        reply = chat_completion.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        return {"error": str(e)}
