from uuid import UUID
from app.api.dependencies import ChatServiceDep, CurrentUserIdDep
from app.schemas.chat import UpdateChat
from fastapi import APIRouter, BackgroundTasks

router = APIRouter(prefix="/chat", tags=["Chats"])

@router.post("/new")
async def create_chat(user_id: CurrentUserIdDep, service: ChatServiceDep):
    return await service.create_chat(user_id)

@router.get("/all")
async def get_all(user_id: CurrentUserIdDep, service: ChatServiceDep):
    return await service.get_all(user_id)

@router.get("/{chat_id}")
async def get_one(chat_id: UUID, user_id: CurrentUserIdDep, service: ChatServiceDep):
    return await service.get_one(user_id, chat_id)

@router.delete("/{chat_id}", status_code=204)
async def delete_chat(
    chat_id: UUID, 
    user_id: CurrentUserIdDep, 
    service: ChatServiceDep,
    background_tasks: BackgroundTasks
):
    await service.delete_chat(user_id, chat_id, background_tasks)

@router.put("/{chat_id}")
async def update_chat(chat_id: UUID, data: UpdateChat, user_id: CurrentUserIdDep, service: ChatServiceDep):
    return await service.update_chat(user_id, chat_id, data.title)