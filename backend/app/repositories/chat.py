from uuid import UUID
from sqlmodel import select
from app.models import Chat
from app.models.message import Message
from sqlmodel.ext.asyncio.session import AsyncSession

class ChatRepository:
    def __init__(self, session : AsyncSession):
        self.session = session

    async def create_chat(self, chat):
        self.session.add(chat)
        await self.session.commit()
        return chat
    
    async def get_all_chats(self, user_id : UUID):
        result = await self.session.exec(
            select(Chat).where(Chat.user_id == user_id).order_by(Chat.updated_at.desc())
        )
        return result.all()

    async def get_one_chat(self, user_id : UUID, chat_id : UUID):
        result = await self.session.exec(select(Chat).where(Chat.user_id == user_id, Chat.id == chat_id))
        chat = result.first()
        if not chat:
            from app.utils.exceptions import ChatNotFound
            raise ChatNotFound()
        return chat

    async def delete_chat_by_id(self, user_id: UUID, chat_id: UUID):
        from sqlmodel import text
        from app.utils.exceptions import ChatNotFound
        
        # Database technique: Common Table Expression (CTE)
        # This single SQL query finds the chat, deletes all its messages, and then deletes the chat itself
        # entirely on the database server. This eliminates 2 full network round-trips!
        sql = text("""
            WITH target_chat AS (
                SELECT id FROM chats WHERE id = :chat_id AND user_id = :user_id
            ),
            deleted_messages AS (
                DELETE FROM messages WHERE chat_id IN (SELECT id FROM target_chat)
            )
            DELETE FROM chats WHERE id IN (SELECT id FROM target_chat) RETURNING id;
        """)
        
        result = await self.session.exec(sql, params={"chat_id": chat_id, "user_id": user_id})
        if not result.first():
            raise ChatNotFound()
            
        await self.session.commit()

    async def update_chat(self, chat: Chat):
        self.session.add(chat)
        await self.session.commit()
        return chat