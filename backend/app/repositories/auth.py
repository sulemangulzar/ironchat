from app.schemas.auth import CreateUser
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.user import User
from sqlmodel import select

class UserRepository:
    def __init__(self, session : AsyncSession):
        self.session = session
    
    async def get_by_email(self, email : str):
        result = await self.session.exec(select(User).where(User.email == email))
        return result.first()

    async def create(self, user : CreateUser):
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def update(self, user: User, update_data: dict):
        for key, value in update_data.items():
            setattr(user, key, value)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def delete(self, user: User):
        await self.session.delete(user)
        await self.session.commit()