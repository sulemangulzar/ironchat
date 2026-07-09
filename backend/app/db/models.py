from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"

    id: str = Field(primary_key=True)
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)


class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(foreign_key="chat_sessions.id", index=True)
    role: str
    content: str
    created_at: datetime | None = Field(default=None)
