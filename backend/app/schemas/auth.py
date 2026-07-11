from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import EmailStr
from pydantic import BaseModel

 
class CreateUser(BaseModel):
    username : str
    email : EmailStr
    password : str

class UpdateUser(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserRead(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime
    updated_at: datetime

class RefreshTokenRequest(BaseModel):
    refresh_token: str