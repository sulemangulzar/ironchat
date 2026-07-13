from uuid import UUID
from app.models import Chat
from app.repositories.chat import ChatRepository

class ChatService:
    def __init__(self, repositroy : ChatRepository):
        self.repository = repositroy
    
    async def create_chat(self, user_id: UUID):
        title = "New Chat"
        new_chat = Chat(title=title, user_id=user_id)
        return await self.repository.create_chat(new_chat)

    async def get_all(self, user_id: UUID):
        return await self.repository.get_all_chats(user_id)

    async def get_one(self, user_id : UUID, chat_id : UUID):
        return await self.repository.get_one_chat(user_id, chat_id)

    async def delete_chat(self, user_id: UUID, chat_id: UUID):
        # Optimized: Delete messages and chat in a single round-trip without fetching first
        await self.repository.delete_chat_by_id(user_id, chat_id)

    async def update_chat(self, user_id: UUID, chat_id: UUID, title: str):
        from datetime import datetime, timezone
        chat = await self.repository.get_one_chat(user_id, chat_id)
        chat.title = title
        chat.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
        return await self.repository.update_chat(chat)