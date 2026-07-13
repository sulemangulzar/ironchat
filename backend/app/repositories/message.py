from app.models.message import Message, Role
from app.models.chat import Chat
from sqlmodel import select
from uuid import UUID
from sqlmodel.ext.asyncio.session import AsyncSession

class MessageRepository:
    def __init__(self, session : AsyncSession):
        self.session = session
    
    async def get_all_messages(self, chat_id: UUID):
        result = await self.session.exec(
            select(Message).where(Message.chat_id == chat_id).order_by(Message.created_at)
        )
        return result.all()

    async def get_all_messages_for_user(self, chat_id: UUID, user_id: UUID):
        result = await self.session.exec(
            select(Message).join(Chat).where(Message.chat_id == chat_id, Chat.user_id == user_id).order_by(Message.created_at)
        )
        return result.all()
    
    async def save_message(self, chat_id: UUID, role: Role, content: str):
        message = Message(chat_id=chat_id, role=role, content=content)
        self.session.add(message)
        await self.session.commit()
        return message