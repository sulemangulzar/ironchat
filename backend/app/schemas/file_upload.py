from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from app.models.file_uploads import FileStatus


class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    storage_path: str
    file_size_bytes: int
    status: FileStatus
    user_id: UUID
    chat_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
