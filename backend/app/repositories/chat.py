from uuid import UUID
from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.chat import Conversation, Message
from app.schemas.chat import CreateChat

class ChatRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_chat(self, chat_data: Conversation) -> Conversation:
        self.session.add(chat_data)
        await self.session.commit()
        await self.session.refresh(chat_data)
        return chat_data
    
    async def get_chat_by_id(self, chat_id: UUID) -> Optional[Conversation]:
        result = await self.session.exec(select(Conversation).where(Conversation.id == chat_id))
        return result.first()
        
    async def get_user_chats(self, user_id: UUID) -> List[Conversation]:
        result = await self.session.exec(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.created_at.desc())
        )
        return list(result.all())

    async def create_message(self, message: Message) -> Message:
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message
        
    async def get_messages_by_chat_id(self, chat_id: UUID, limit: int = 50) -> List[Message]:
        result = await self.session.exec(
            select(Message)
            .where(Message.conversation_id == chat_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        return list(result.all())
        
    async def update_chat_title(self, chat_id: UUID, title: str) -> Optional[Conversation]:
        chat = await self.get_chat_by_id(chat_id)
        if chat:
            chat.title = title
            self.session.add(chat)
            await self.session.commit()
            await self.session.refresh(chat)
        return chat

    async def delete_chat(self, chat: Conversation) -> None:
        await self.session.delete(chat)
        await self.session.commit()