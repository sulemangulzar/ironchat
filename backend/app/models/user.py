from sqlalchemy import func
from sqlalchemy import DateTime
from sqlalchemy import Column
from datetime import datetime
from pydantic import EmailStr
from uuid import uuid4
from sqlmodel import Field
from uuid import UUID
from sqlmodel import SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id : UUID = Field(primary_key=True, default_factory=uuid4, nullable=False)
    name: str = Field(nullable=False)
    email : EmailStr = Field(unique=True, nullable=False)
    hashed_password : str = Field(nullable=False)
    is_active : bool = Field(default=True)
    auth_provider : str = Field(default="local", nullable=False)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
        )
    )
    updated_at : datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            default=func.now(),
            onupdate=func.now()
        )
    )
