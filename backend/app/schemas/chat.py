from pydantic import BaseModel

class ChatRequest(BaseModel):
    session_id: str
    message : str

class CreateChat(BaseModel):
    title : str


class CreateMessage(BaseModel):
    message : str