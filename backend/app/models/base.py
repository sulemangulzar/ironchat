from uuid import UUID, uuid4
from datetime import datetime, timezone

from sqlmodel import SQLModel, Field

def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

from sqlalchemy import text, func

class TimestampMixin(SQLModel):
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")}
    )
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column_kwargs={
            "server_default": text("CURRENT_TIMESTAMP"),
            "onupdate": func.now()
        }
    )


class UUIDMixin(SQLModel):
    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")}
    )