from app.core.security import get_hashed_password
from app.exceptions import UserAlreadyExists
from sqlmodel import select
from app.schemas.auth import CreateUser, LoginRequest, UpdateUser
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.user import User
from app.repositories.auth import UserRepository
import asyncio


class UserService:
    def __init__(self, repository : UserRepository):
        self.repositroy = repository

    async def create(self, credentials : CreateUser):
        user_exists = await self.repositroy.get_by_email(credentials.email)
        if user_exists:
            raise UserAlreadyExists
        
        hashed_pw = await asyncio.to_thread(get_hashed_password, credentials.password)

        user = User(name = credentials.name, email=str(credentials.email), hashed_password = hashed_pw)
        created_user = await self.repositroy.create(user)
        return created_user

    async def authenticate_user(self, credentials: LoginRequest) -> User:
        user = await self.repositroy.get_by_email(credentials.email)
        if not user:
            from fastapi import HTTPException, status
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        from app.core.security import verify_password
        is_password_valid = await asyncio.to_thread(verify_password, credentials.password, user.hashed_password)
        if not is_password_valid:
            from fastapi import HTTPException, status
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
            
        return user

    async def update_current_user(self, user: User, update_data: UpdateUser) -> User:
        data = update_data.model_dump(exclude_unset=True)
        if "password" in data:
            hashed_pw = await asyncio.to_thread(get_hashed_password, data.pop("password"))
            data["hashed_password"] = hashed_pw
            
        updated_user = await self.repositroy.update(user, data)
        return updated_user

    async def delete_current_user(self, user: User):
        await self.repositroy.delete(user)