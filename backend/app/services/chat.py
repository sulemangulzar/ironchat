import logging
from uuid import UUID
from fastapi import BackgroundTasks
from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.models import Chat
from app.repositories.chat import ChatRepository
from app.repositories.file_upload import FileUploadRepository
from app.core.qdrant import qdrant_client, COLLECTION_NAME


class ChatService:
    def __init__(self, repository: ChatRepository, file_repo: FileUploadRepository = None):
        self.repository = repository
        self.file_repo = file_repo

    async def create_chat(self, user_id: UUID):
        title = "New Chat"
        new_chat = Chat(title=title, user_id=user_id)
        return await self.repository.create_chat(new_chat)

    async def get_all(self, user_id: UUID):
        return await self.repository.get_all_chats(user_id)

    async def get_one(self, user_id: UUID, chat_id: UUID):
        return await self.repository.get_one_chat(user_id, chat_id)

    async def delete_chat(self, user_id: UUID, chat_id: UUID, background_tasks: BackgroundTasks = None):
        # 1. Delete Qdrant vectors associated with this chat_id
        try:
            await qdrant_client.delete(
                collection_name=COLLECTION_NAME,
                points_selector=Filter(
                    must=[
                        FieldCondition(
                            key="chat_id",
                            match=MatchValue(value=str(chat_id)),
                        )
                    ]
                ),
            )
        except Exception as e:
            logging.error(f"Error cleaning Qdrant vectors for chat {chat_id}: {e}")

        # 2. Delete database Document records associated with this chat_id
        if self.file_repo:
            try:
                await self.file_repo.delete_documents_by_chat_id(chat_id)
            except Exception as e:
                logging.error(f"Error deleting documents for chat {chat_id}: {e}")

        # 3. Delete messages and chat
        await self.repository.delete_chat_by_id(user_id, chat_id)

    async def update_chat(self, user_id: UUID, chat_id: UUID, title: str):
        from datetime import datetime, timezone
        chat = await self.repository.get_one_chat(user_id, chat_id)
        chat.title = title
        chat.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
        return await self.repository.update_chat(chat)