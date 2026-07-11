from uuid import UUID
from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship
from .base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from .user import User

class OAuthAccount(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "oauth_accounts"

    oauth_name: str
    access_token: str
    expires_at: int | None = None
    account_id: str
    account_email: str

    user_id: UUID = Field(foreign_key="users.id")
    user: "User" = Relationship(back_populates="oauth_accounts")
