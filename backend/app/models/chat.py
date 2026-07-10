from typing import Optional
from enum import Enum
from typing import List
from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, DateTime, func

class Role(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False) 
    user_id: UUID = Field(foreign_key="users.id", nullable=False) 
    title: str = Field(nullable=True)
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), default=func.now(), nullable=False))
    
    messages: List["Message"] = Relationship(back_populates="conversation", cascade_delete=True)
    

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False) 
    conversation_id: UUID = Field(foreign_key="conversations.id", nullable=False)
    role: Role = Field(nullable=False) 
    content: str = Field(nullable=False)
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), default=func.now(), nullable=False))  

    conversation: Conversation = Relationship(back_populates="messages")