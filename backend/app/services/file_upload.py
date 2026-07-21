import uuid
from fastapi import UploadFile

from app.repositories.file_upload import FileUploadRepository
from app.models.documents import Document, DocumentStatus
from app.core.supabase import upload_document
from app.core.config import settings

class FileUploadService:
    def __init__(self, repository: FileUploadRepository):
        self.repository = repository
        
    async def upload_and_save_document(
        self,
        file: UploadFile,
        file_bytes: bytes,
        chat_id: uuid.UUID,
        user_id: uuid.UUID,
        document_id: uuid.UUID,
    ) -> Document:
        filename = file.filename or "document.pdf"
        content_type = file.content_type or "application/pdf"
        
        # 1. Upload to Supabase
        storage_path = upload_document(
            file_bytes=file_bytes,
            user_id=str(user_id),
            chat_id=str(chat_id),
            document_id=str(document_id),
            filename=filename,
            content_type=content_type,
        )
        
        # 2. Save to database
        document = Document(
            id=document_id,
            user_id=user_id,
            chat_id=chat_id,
            filename=filename,
            storage_bucket=settings.SUPABASE_BUCKET,
            storage_path=storage_path,
            mime_type=content_type,
            file_size=len(file_bytes),
            status=DocumentStatus.PROCESSING,
        )
        
        await self.repository.save_document(document)
        return document
