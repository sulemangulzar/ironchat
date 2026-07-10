from uuid import UUID
from typing import List
from fastapi import APIRouter
from app.api.dependencies import CurrentUserDep, ChatServiceDep
from app.schemas.chat import CreateMessage
from app.models.chat import Conversation, Message

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=Conversation)
async def create_new_chat(user: CurrentUserDep, service: ChatServiceDep):
    return await service.create_chat(user.id)

@router.get("", response_model=List[Conversation])
async def get_all_chats(user: CurrentUserDep, service: ChatServiceDep):
    return await service.get_user_chats(user.id)

@router.get("/{chat_id}", response_model=List[Message])
async def get_chat_history(chat_id: UUID, user: CurrentUserDep, service: ChatServiceDep):
    return await service.get_chat_messages(chat_id, user.id)

@router.post("/{chat_id}/message", response_model=Message)
async def send_message(chat_id: UUID, message_data: CreateMessage, user: CurrentUserDep, service: ChatServiceDep):
    return await service.create_message(chat_id, user.id, message_data)

@router.delete("/{chat_id}", status_code=204)
async def delete_chat(chat_id: UUID, user: CurrentUserDep, service: ChatServiceDep):
    """Deletes a conversation and all its messages."""
    await service.delete_chat(chat_id, user.id)