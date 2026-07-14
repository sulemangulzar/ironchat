from pydantic import BaseModel

class SendMessage(BaseModel):
    content: str
    enable_search: bool = False