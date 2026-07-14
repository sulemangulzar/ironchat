from app import models
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl,ConfigDict

class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

class SearchWebParams(StrictModel):
    query : str = Field(min_length=2, max_length=128, description="The precise search query to look up.",)
    max_results: int = Field( default=5, ge=1, le=10, description="Number of search results to return.", )

class SearchResult(StrictModel):
    title : str
    url : HttpUrl
    snippet : str

class SearchWebReturn(StrictModel): 
    status: str = Field( description="Either 'success' or 'error'." ) 
    results: Optional[list[SearchResult]] = None 
    error_message: Optional[str] = None 
    error_resolution: Optional[str] = None


