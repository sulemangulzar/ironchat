from pydantic import EmailStr
from pydantic import BaseModel


class CreateUser(BaseModel):
    name : str
    email : EmailStr
    password : str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateUser(BaseModel):
    name: str | None = None
    password: str | None = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

from uuid import UUID
from datetime import datetime

class UserRead(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    is_active: bool
    created_at: datetime
    updated_at: datetime
    