from app.services.chat import ChatService
from app.repositories.chat import ChatRepository
from uuid import UUID
from app.services.auth import UserService
from fastapi import Depends
from typing import Annotated
from app.db.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from app.repositories.auth import UserRepository

SessionDep = Annotated[AsyncSession, Depends(get_session)]

def get_user_service(session : SessionDep):
    repository = UserRepository(session)
    return UserService(repository)

UserServiceDep = Annotated[UserService, Depends(get_user_service)]

from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token
from fastapi import HTTPException, status
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/v1/login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    id : UUID = payload.get("sub")
    if id is None:
        raise credentials_exception
        
    repository = UserRepository(session)
    user = await repository.get_by_id(id)
    if user is None:
        raise credentials_exception
    return user

CurrentUserDep = Annotated[User, Depends(get_current_user)]

def get_chat_service(session : SessionDep):
    repository = ChatRepository(session)
    return ChatService(repository)

ChatServiceDep = Annotated[ChatService, Depends(get_chat_service)]