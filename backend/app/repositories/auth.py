from app.models.refresh_token import RefreshToken
from app.models.oauth_account import OAuthAccount
from app.schemas.auth import CreateUser
from sqlmodel import select
from sqlalchemy import UUID
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.user import User

class UserRepository:
    def __init__(self, session : AsyncSession):
        self.session = session
    
    async def get_by_email(self, email : str):
        result = await self.session.exec(select(User).where(User.email == email))
        return result.first()

    async def get_by_username(self, username: str):
        result = await self.session.exec(select(User).where(User.username == username))
        return result.first()

    async def get_by_id(self, id : UUID):
        result = await self.session.exec(select(User).where(User.id == id))
        return result.first()
    
    async def create(self, user : User):
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def save_refresh_token(self, refresh_token):
        self.session.add(refresh_token)
        await self.session.commit()
        await self.session.refresh(refresh_token)
        return refresh_token

    async def get_refresh_tokens_by_user(self, user_id: UUID):
        from app.models.refresh_token import RefreshToken
        result = await self.session.exec(select(RefreshToken).where(RefreshToken.user_id == user_id))
        return result.all()

    async def delete_refresh_token(self, refresh_token):
        await self.session.delete(refresh_token)
        await self.session.commit()
    
    async def delete_all_refresh_token(self, user_id):
        result = await self.session.exec(select(RefreshToken).where(RefreshToken.user_id == user_id))
        for token in result.all():
            await self.session.delete(token)
        await self.session.commit()

    async def update(self, user: User):
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def delete(self, user: User):
        await self.session.delete(user)
        await self.session.commit()

    async def get_oauth_account_by_account_id(self, oauth_name: str, account_id: str):
        result = await self.session.exec(
            select(OAuthAccount).where(
                OAuthAccount.oauth_name == oauth_name,
                OAuthAccount.account_id == account_id,
            )
        )
        return result.first()

    async def create_oauth_account(self, oauth_account: OAuthAccount):
        self.session.add(oauth_account)
        await self.session.commit()
        await self.session.refresh(oauth_account)
        return oauth_account

    async def update_oauth_account(self, oauth_account: OAuthAccount):
        self.session.add(oauth_account)
        await self.session.commit()
        await self.session.refresh(oauth_account)
        return oauth_account