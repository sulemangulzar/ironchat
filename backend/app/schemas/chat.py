from pydantic import BaseModel

class UpdateChat(BaseModel):
    title: str
