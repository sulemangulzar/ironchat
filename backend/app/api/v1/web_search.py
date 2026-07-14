from typing import Any

from tavily import AsyncTavilyClient

from app.core.config import settings

from app.tools.websearch.schemas import SearchWebParams

tavily_client = AsyncTavilyClient(
    api_key=settings.TAVILY_API_KEY
)

from fastapi import APIRouter, HTTPException


router = APIRouter(prefix="/web", tags=["Web Search"])


@router.post("/search")
async def web_search_endpoint(
    request: SearchWebParams,
):
    try:
        return await search_web(
            query=request.query,
            max_results=request.max_results,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Tavily request failed: {exc}",
        ) from exc

async def search_web(
    query: str,
    max_results: int = 5,
) -> dict[str, Any]:
    max_results = max(1, min(max_results, 10))

    response = await tavily_client.search(
        query=query,
        search_depth="basic",
        max_results=max_results,
        include_answer=False,
        include_raw_content=False,
    )
    

    filtered_results = []
    seen_urls = set()
    for result in response.get("results", []):
        url = result.get("url")
        content = result.get("content")
        if url and url not in seen_urls:
            seen_urls.add(url)
            filtered_results.append({
                "title": result.get("title", ""),
                "url": url,
                "content": content[:1000] if content else "",
                "score": result.get("score", 0.0),
                "published_date": result.get("published_date"),
            })

    return {
        "query": query,
        "results": filtered_results,
    }
