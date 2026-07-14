from app.utils.exceptions import InvalidToken
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_hash,
    hash_token,
    verify_hash,
    verify_token_hash,
)
from app.utils.exceptions import LoginException, UserAlreadyExists, OAuthAccountExistsException
from app.models import User
import asyncio
from app.schemas.auth import CreateUser
from app.repositories.auth import UserRepository
from uuid import UUID
from datetime import datetime, timezone, timedelta
from app.core.config import settings
from app.models.refresh_token import RefreshToken
from app.models.oauth_account import OAuthAccount

class UserService:
    def __init__(self, repository : UserRepository):
        self.repositroy = repository
    
    async def create(self, credentials : CreateUser):
        user_exists = await self.repositroy.get_by_email(credentials.email)
        if user_exists:
            if not user_exists.hashed_password:
                raise OAuthAccountExistsException()
            raise UserAlreadyExists()
        
        hashed_pw = await asyncio.to_thread(get_hash, credentials.password)

        user = User(
            username=credentials.username, 
            email=str(credentials.email), 
            hashed_password=hashed_pw
        )
        return await self.repositroy.create(user)

    async def login(self, email : str, password : str):
        user = await self.repositroy.get_by_email(email)
        if not user:
            raise LoginException()
        if not user.hashed_password:
            raise OAuthAccountExistsException()
            
        is_valid = await asyncio.to_thread(verify_hash, password, user.hashed_password)
        if not is_valid:
            raise LoginException()

        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        
        hashed_rt = hash_token(refresh_token)
        expires_dt = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        db_rt = RefreshToken(
            token=hashed_rt,
            expires_at=int(expires_dt.timestamp()),
            user_id=user.id,
        )
        await self.repositroy.save_refresh_token(db_rt)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    async def refresh_token(self, old_refresh_token: str):
        
        payload = decode_token(old_refresh_token)
        if not payload:
            raise InvalidToken()
        
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise InvalidToken()
        
        try:
            user_id = UUID(user_id_str)
        except ValueError:
            raise InvalidToken()

        user = await self.repositroy.get_by_id(user_id)
        if not user:
            raise InvalidToken()

        db_tokens = await self.repositroy.get_refresh_tokens_by_user(user_id)
        valid_db_token = None
        incoming_hash = hash_token(old_refresh_token)
        for t in db_tokens:
            if verify_token_hash(old_refresh_token, t.token):
                valid_db_token = t
                break
            # backward compat: old tokens were stored as bcrypt hashes
            try:
                if verify_hash(old_refresh_token, t.token):
                    valid_db_token = t
                    break
            except Exception:
                pass
        
        if not valid_db_token:
            raise InvalidToken()
        
        now = int(datetime.now(timezone.utc).timestamp())
        if valid_db_token.expires_at < now:
            await self.repositroy.delete_refresh_token(valid_db_token)
            raise InvalidToken("Refresh token expired")

        await self.repositroy.delete_refresh_token(valid_db_token)
        
        new_access_token = create_access_token({"sub": str(user.id)})
        new_refresh_token = create_refresh_token({"sub": str(user.id)})

        hashed_rt = hash_token(new_refresh_token)
        expires_dt = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        db_rt = RefreshToken(
            token=hashed_rt,
            expires_at=int(expires_dt.timestamp()),
            user_id=user.id,
        )
        await self.repositroy.save_refresh_token(db_rt)

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }

    async def update_user(self, user: User, data):
        if data.username is not None:
            user.username = data.username
        if data.email is not None:
            user.email = str(data.email)
        if data.password is not None:
            hashed_pw = await asyncio.to_thread(get_hash, data.password)
            user.hashed_password = hashed_pw
        return await self.repositroy.update(user)

    async def delete_user(self, user: User):
        await self.repositroy.delete(user)
    
    async def google_oauth_login(self, user_info: dict, token_data: dict):
        email = user_info.get("email", "")
        google_id = user_info.get("sub", "")
        name = user_info.get("name") or user_info.get("given_name") or email.split("@")[0]
        avatar_url = user_info.get("picture")
        google_access_token = token_data.get("access_token", "")
        expires_at = token_data.get("expires_in")

        user = await self.repositroy.get_by_email(email)

        if not user:
            import re
            base_username = re.sub(r"[^a-zA-Z0-9_]", "", name.replace(" ", "_"))[:40] or "user"
            username = base_username
            counter = 1
            while await self.repositroy.get_by_username(username):
                username = f"{base_username}_{counter}"
                counter += 1

            user = User(
                username=username,
                email=email,
                avatar_url=avatar_url,
                hashed_password=None,
            )
            user = await self.repositroy.create(user)

        existing_oauth = await self.repositroy.get_oauth_account_by_account_id("google", google_id)

        if existing_oauth:
            existing_oauth.access_token = google_access_token
            existing_oauth.expires_at = int(expires_at) if expires_at else None
            await self.repositroy.update_oauth_account(existing_oauth)
        else:
            oauth_account = OAuthAccount(
                oauth_name="google",
                access_token=google_access_token,
                expires_at=int(expires_at) if expires_at else None,
                account_id=google_id,
                account_email=email,
                user_id=user.id,
            )
            await self.repositroy.create_oauth_account(oauth_account)

        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        hashed_rt = hash_token(refresh_token)
        expires_dt = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        db_rt = RefreshToken(
            token=hashed_rt,
            expires_at=int(expires_dt.timestamp()),
            user_id=user.id,
        )
        await self.repositroy.save_refresh_token(db_rt)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    async def logout(self, refresh_token):
        payload = decode_token(refresh_token)
        if not payload:
            raise InvalidToken()
        
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise InvalidToken()
        
        try:
            user_id = UUID(user_id_str)
        except ValueError:
            raise InvalidToken()

        user = await self.repositroy.get_by_id(user_id)
        if not user:
            raise InvalidToken()
        
        remove_token = await self.repositroy.delete_all_refresh_token(user_id)
        return {"message": "Logged Out Successfully"}