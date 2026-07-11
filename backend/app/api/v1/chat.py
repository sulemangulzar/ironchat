from uuid import UUID
from app.api.dependencies import ChatServiceDep
from app.api.dependencies import CurrentUserDep
from app.schemas.chat import UpdateChat
from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["Chats"])

@router.post("/new")
async def create_chat(user : CurrentUserDep, service : ChatServiceDep):
    return await service.create_chat(user.id)


@router.get("/all")
async def get_all(user : CurrentUserDep, service : ChatServiceDep):
    return await service.get_all(user.id)

@router.get("/{chat_id}")
async def get_one(chat_id : UUID,user : CurrentUserDep, service : ChatServiceDep):
    return await service.get_one(user.id,chat_id)

@router.delete("/{chat_id}", status_code=204)
async def delete_chat(chat_id: UUID, user: CurrentUserDep, service: ChatServiceDep):
    await service.delete_chat(user.id, chat_id)

@router.put("/{chat_id}")
async def update_chat(chat_id: UUID, data: UpdateChat, user: CurrentUserDep, service: ChatServiceDep):
    return await service.update_chat(user.id, chat_id, data.title)