from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from .chat import Chat

from .base import UUIDMixin, TimestampMixin

class Role(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"

class Message(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "messages"

    role: Role

    content: str

    chat_id: UUID = Field(foreign_key="chats.id")

    chat: "Chat" = Relationship(back_populates="messages")