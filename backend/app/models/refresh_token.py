from uuid import UUID
from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship
from .base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from .user import User

class RefreshToken(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "refresh_tokens"

    token: str = Field(index=True, unique=True)
    expires_at: int
    
    user_id: UUID = Field(foreign_key="users.id")
    user: "User" = Relationship(back_populates="refresh_tokens")
