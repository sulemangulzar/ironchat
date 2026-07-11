from app.api.dependencies import MessageServiceDep
from app.api.dependencies import CurrentUserDep
from app.schemas.message import SendMessage
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from uuid import UUID

router = APIRouter(prefix="/chat", tags=["Messages"])

@router.get("/{chat_id}/messages")
async def messages(chat_id: UUID, user: CurrentUserDep, service: MessageServiceDep):
    return await service.get_messages(chat_id, user.id)

@router.post("/{chat_id}/message")
async def message(chat_id: UUID, data: SendMessage, user: CurrentUserDep, service: MessageServiceDep):
    generator = await service.generate_response(chat_id, data, user.id)
    return StreamingResponse(generator, media_type="text/event-stream")