from uuid import UUID
from sqlmodel import select
from app.models import Chat
from sqlmodel.ext.asyncio.session import AsyncSession

class ChatRepository:
    def __init__(self, session : AsyncSession):
        self.session = session

    async def create_chat(self, chat):
        self.session.add(chat)
        await self.session.commit()
        await self.session.refresh(chat)
        return chat
    
    async def get_all_chats(self, user_id : UUID):
        result = await self.session.exec(select(Chat).where(Chat.user_id == user_id))
        return result.all()

    async def get_one_chat(self, user_id : UUID, chat_id : UUID):
        result = await self.session.exec(select(Chat).where(Chat.user_id == user_id, Chat.id == chat_id))
        chat = result.first()
        if not chat:
            from app.utils.exceptions import ChatNotFound
            raise ChatNotFound()
        return chat

    async def delete_chat(self, chat: Chat):
        await self.session.delete(chat)
        await self.session.commit()

    async def update_chat(self, chat: Chat):
        self.session.add(chat)
        await self.session.commit()
        await self.session.refresh(chat)
        return chat