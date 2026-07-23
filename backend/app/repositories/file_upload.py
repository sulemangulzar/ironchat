from uuid import UUID
from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.file_uploads import Document, FileStatus


class FileUploadRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save_document(self, document: Document) -> Document:
        self.session.add(document)
        await self.session.commit()
        await self.session.refresh(document)
        return document

    async def get_document_by_id(self, document_id: UUID) -> Optional[Document]:
        statement = select(Document).where(Document.id == document_id)
        result = await self.session.exec(statement)
        return result.first()

    async def get_user_documents(self, user_id: UUID) -> List[Document]:
        statement = select(Document).where(Document.user_id == user_id)
        result = await self.session.exec(statement)
        return list(result.all())

    async def get_chat_documents(self, chat_id: UUID) -> List[Document]:
        statement = select(Document).where(Document.chat_id == chat_id)
        result = await self.session.exec(statement)
        return list(result.all())

    async def delete_documents_by_chat_id(self, chat_id: UUID) -> int:
        docs = await self.get_chat_documents(chat_id)
        for doc in docs:
            await self.session.delete(doc)
        await self.session.commit()
        return len(docs)

    async def update_status(self, document_id: UUID, status: FileStatus) -> Optional[Document]:
        doc = await self.get_document_by_id(document_id)
        if doc:
            doc.status = status
            self.session.add(doc)
            await self.session.commit()
            await self.session.refresh(doc)
        return doc

