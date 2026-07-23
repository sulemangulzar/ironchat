
import enum
from typing import Optional, TYPE_CHECKING
from uuid import UUID
from sqlmodel import Field, Relationship

from app.models.base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.chat import Chat


class FileStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    INDEXED = "indexed"
    FAILED = "failed"


class Document(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "documents"

    filename: str = Field(index=True)
    file_type: str
    storage_path: str
    file_size_bytes: int
    status: FileStatus = Field(default=FileStatus.UPLOADED, index=True)

    user_id: UUID = Field(foreign_key="users.id", index=True)
    chat_id: Optional[UUID] = Field(default=None, foreign_key="chats.id", index=True)

    user: Optional["User"] = Relationship()
    chat: Optional["Chat"] = Relationship()