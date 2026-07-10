import asyncio
from uuid import UUID
from typing import List
from groq import Groq
from fastapi import HTTPException, status
from app.schemas.chat import CreateChat, CreateMessage
from app.repositories.chat import ChatRepository
from app.models.chat import Conversation, Message, Role
from app.models.user import User
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "You are IronChat, an advanced, highly intelligent, and extremely helpful AI assistant. "
        "Your goal is to assist the user with any questions, tasks, or casual conversations they have. "
        "Be concise, professional, engaging, and always provide clear formatting."
    ),
}

class ChatService:
    def __init__(self, repository: ChatRepository):
        self.repository = repository

    async def create_chat(self, user_id: UUID) -> Conversation:
        chat = Conversation(user_id=user_id, title=None)
        return await self.repository.create_chat(chat)

    async def get_user_chats(self, user_id: UUID) -> List[Conversation]:
        return await self.repository.get_user_chats(user_id)
        
    async def get_chat_messages(self, chat_id: UUID, user_id: UUID) -> List[Message]:
        chat = await self.repository.get_chat_by_id(chat_id)
        if not chat or chat.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
        return await self.repository.get_messages_by_chat_id(chat_id)

    async def create_message(self, chat_id: UUID, user_id: UUID, message_data: CreateMessage) -> Message:
        # Verify chat belongs to user
        chat = await self.repository.get_chat_by_id(chat_id)
        if not chat or chat.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")

        # Check if this is the first message to generate a title
        is_first_message = chat.title is None

        # 1. Save User Message
        user_msg = Message(
            conversation_id=chat_id,
            role=Role.USER,
            content=message_data.message
        )
        await self.repository.create_message(user_msg)

        # 2. Get Chat History
        history = await self.repository.get_messages_by_chat_id(chat_id, limit=10)
        formatted_history = [{"role": msg.role.value, "content": msg.content} for msg in history]
        
        # 3. Call Groq API
        full_payload = [SYSTEM_PROMPT] + formatted_history
        try:
            chat_completion = await asyncio.to_thread(
                client.chat.completions.create,
                messages=full_payload,
                model="llama-3.1-8b-instant",
            )
            reply_content = chat_completion.choices[0].message.content or ""
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"LLM Error: {str(e)}")

        # 4. Save Assistant Message
        assistant_msg = Message(
            conversation_id=chat_id,
            role=Role.ASSISTANT,
            content=reply_content
        )
        saved_assistant_msg = await self.repository.create_message(assistant_msg)

        # 5. Generate Title if it's the first message
        if is_first_message:
            try:
                title_prompt = [
                    {"role": "system", "content": "Generate a very short 2-4 word title for this conversation based on the user's first message. Do not use quotes or prefixes."},
                    {"role": "user", "content": message_data.message}
                ]
                title_completion = await asyncio.to_thread(
                    client.chat.completions.create,
                    messages=title_prompt,
                    model="llama-3.1-8b-instant",
                )
                new_title = title_completion.choices[0].message.content.strip(' "')[:50]
                await self.repository.update_chat_title(chat_id, new_title)
            except Exception:
                pass # Fail silently if title generation fails

        return saved_assistant_msg

    async def delete_chat(self, chat_id: UUID, user_id: UUID) -> None:
        chat = await self.repository.get_chat_by_id(chat_id)
        if not chat or chat.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
        await self.repository.delete_chat(chat)