import base64
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

from app.api.dependencies import UserServiceDep
from app.core.config import settings

router = APIRouter(prefix="/auth/v1", tags=["Google OAuth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.get("/google")
async def google_login(redirect: str | None = None):
    if not settings.GOOGLE_CLIENT_ID:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Google OAuth is not configured on this server.")

    state = base64.urlsafe_b64encode((redirect or "/dashboard").encode()).decode()

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    }

    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@router.get("/google/callback")
async def google_callback(
    request: Request,
    service: UserServiceDep,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
):
    frontend_login = f"{settings.FRONTEND_URL.rstrip('/')}/login"

    if error:
        return RedirectResponse(url=f"{frontend_login}?error={error}")

    if not code:
        return RedirectResponse(url=f"{frontend_login}?error=no_code")

    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            },
        )
        token_data = token_response.json()

        if "access_token" not in token_data:
            return RedirectResponse(url=f"{frontend_login}?error=token_failed")

        userinfo_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )

        if userinfo_response.status_code != 200:
            return RedirectResponse(url=f"{frontend_login}?error=userinfo_failed")

        user_info = userinfo_response.json()

    tokens = await service.google_oauth_login(user_info, token_data)

    try:
        redirect_path = base64.urlsafe_b64decode(state).decode() if state else "/dashboard"
    except Exception:
        redirect_path = "/dashboard"

    if not redirect_path.startswith("/"):
        redirect_path = "/" + redirect_path

    redirect_url = (
        f"{settings.FRONTEND_URL.rstrip('/')}{redirect_path}"
        f"?access_token={tokens['access_token']}&refresh_token={tokens['refresh_token']}"
    )
    return RedirectResponse(url=redirect_url)
