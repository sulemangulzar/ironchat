from app.services.message import MessageService
from app.repositories.message import MessageRepository
from app.services.chat import ChatService
from app.repositories.chat import ChatRepository
from app.models import User
from uuid import UUID
from app.utils.exceptions import InvalidToken
from app.core.security import decode_token
from app.repositories.auth import UserRepository
from app.services.auth import UserService
from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Annotated
from app.core.database import get_session
from fastapi.security import OAuth2PasswordBearer

oauth_scheme = OAuth2PasswordBearer(tokenUrl="/auth/v1/login")


SessionDep = Annotated[AsyncSession, Depends(get_session)]

def get_user_service(session : SessionDep):
    repository = UserRepository(session)
    return UserService(repository)

UserServiceDep = Annotated[UserService, Depends(get_user_service)]

def get_current_user_id(token: Annotated[str, Depends(oauth_scheme)]) -> UUID:
    """Fast path: decode JWT only, no DB hit. Use for any route that only needs user.id."""
    payload = decode_token(token)
    if payload is None:
        raise InvalidToken()

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise InvalidToken()

    try:
        return UUID(user_id_str)
    except ValueError:
        raise InvalidToken()

CurrentUserIdDep = Annotated[UUID, Depends(get_current_user_id)]

async def get_current_user(token: Annotated[str, Depends(oauth_scheme)], session: SessionDep):
    """Full path: decode JWT + DB lookup. Only use for routes that need the User object."""
    user_id = get_current_user_id(token)

    repository = UserRepository(session)
    user = await repository.get_by_id(user_id)
    if not user:
        raise InvalidToken()

    return user

CurrentUserDep = Annotated[User, Depends(get_current_user)]

def get_chat_service(session : SessionDep):
    repository = ChatRepository(session)
    return ChatService(repository)

ChatServiceDep = Annotated[ChatService, Depends(get_chat_service)]

def get_message_service(session : SessionDep):
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)
    return MessageService(msg_repo, chat_repo)

MessageServiceDep = Annotated[MessageService, Depends(get_message_service)]

def get_file_upload_service(session: SessionDep):
    from app.repositories.file_upload import FileUploadRepository
    from app.services.file_upload import FileUploadService
    repo = FileUploadRepository(session)
    return FileUploadService(repo)

FileUploadServiceDep = Annotated["FileUploadService", Depends(get_file_upload_service)]

