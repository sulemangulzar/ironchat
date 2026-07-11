from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .oauth_account import OAuthAccount
    from .chat import Chat
    from .refresh_token import RefreshToken


from sqlmodel import SQLModel, Field, Relationship

from .base import UUIDMixin, TimestampMixin


class User(UUIDMixin, TimestampMixin, table=True):
    __tablename__ = "users"

    username: str = Field(index=True, unique=True, max_length=50)
    email: str = Field(index=True, unique=True, max_length=255)

    hashed_password: Optional[str] = None

    avatar_url: Optional[str] = None

    is_active: bool = True

    chats: List["Chat"] = Relationship(back_populates="user")

    oauth_accounts: List["OAuthAccount"] = Relationship(
        back_populates="user"
    )

    refresh_tokens: List["RefreshToken"] = Relationship(
        back_populates="user"
    )
