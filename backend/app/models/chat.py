from typing import Optional, List, TYPE_CHECKING
from uuid import UUID

if TYPE_CHECKING:
    from .message import Message
    from .user import User

from sqlmodel import Field, Relationship

from .base import UUIDMixin, TimestampMixin


class Chat(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "chats"

    title: Optional[str] = None

    model: str = "llama-3.3-70b-versatile"

    user_id: UUID = Field(foreign_key="users.id")

    user: "User" = Relationship(back_populates="chats")

    messages: List["Message"] = Relationship(
        back_populates="chat"
    )