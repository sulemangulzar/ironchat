from fastapi.responses import RedirectResponse
from alembic import operations
from app.core.config import settings
from fastapi import Response, Request
from app.api.dependencies import UserServiceDep, CurrentUserDep
from app.schemas.auth import CreateUser, LoginRequest, Token, RefreshTokenRequest, UserRead, UpdateUser
from app.core.security import create_access_token, create_refresh_token, decode_token
from fastapi import APIRouter, HTTPException, status
import secrets
import urllib.parse
import httpx



router = APIRouter(prefix="/auth/v1", tags=["auth"])

@router.post("/signup", response_model=UserRead)
async def signup(credentials : CreateUser, service : UserServiceDep):
    return await service.create(credentials)

@router.post("/login", response_model=Token)
async def login(credentials: LoginRequest, service: UserServiceDep):
    user_db = await service.repositroy.get_by_email(credentials.email)
    if user_db and user_db.auth_provider == "google":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="It looks like you signed up with Google. Please use the 'Log in with Google' button."
        )

    user = await service.authenticate_user(credentials)
    
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.get("/google/login")
async def google_login():
    state = secrets.token_urlsafe(32)

    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id":settings.CLIENT_ID,
        "redirect_uri": settings.REDIRECT_URI, 
        "response_type": "code",
        "scope": "openid email profile",
        "state": state
    }

    url_params = urllib.parse.urlencode(params)
    google_auth_url = f"{base_url}?{url_params}"
    
    response = RedirectResponse(url=google_auth_url)
    response.set_cookie(key="oauth_state", value=state, httponly=True, max_age=300, samesite="lax", secure=False)
    return response

@router.get("/google/callback")
async def google_callback(request: Request, service: UserServiceDep, state: str | None = None, code: str | None = None, error: str | None = None):
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Google Auth Error: {error}")
    if not code or not state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing code or state. Did you navigate here directly?")
        
    cookie_state = request.cookies.get("oauth_state")
    if not cookie_state or cookie_state != state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state parameter")
    
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "client_id": settings.CLIENT_ID,
        "client_secret": settings.CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": settings.REDIRECT_URI
    }
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=token_data)
        token_response_data = token_response.json()
        
        if "error" in token_response_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to fetch token from Google")
            
        access_token = token_response_data.get("access_token")
        
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_response = await client.get(user_info_url, headers=headers)
        user_info = user_info_response.json()
        
    email = user_info.get("email")
    name = user_info.get("name", "")
    
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not get email from Google")
        
    user = await service.repositroy.get_by_email(email)
    if not user:
        random_password = secrets.token_urlsafe(16)
        user_create = CreateUser(name=name, email=email, password=random_password, auth_provider="google")
        user = await service.create(user_create)
        
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    frontend_url = settings.ALLOWED_ORIGINS.split(",")[0]
    redirect_url = f"{frontend_url}/auth/callback?access_token={access_token}&refresh_token={refresh_token}"
    
    response = RedirectResponse(url=redirect_url)
    response.delete_cookie("oauth_state")
    return response

@router.post("/refresh", response_model=Token)
async def refresh_token(request: RefreshTokenRequest, service: UserServiceDep):

    payload = decode_token(request.refresh_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
    user = await service.repositroy.get_by_email(email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")
        
    access_token = create_access_token(data={"sub": user.email})
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )

@router.get("/me", response_model=UserRead)
async def get_me(current_user: CurrentUserDep):
    return current_user

@router.patch("/me", response_model=UserRead)
async def update_me(update_data: UpdateUser, current_user: CurrentUserDep, service: UserServiceDep):
    return await service.update_current_user(current_user, update_data)

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(current_user: CurrentUserDep, service: UserServiceDep):
    await service.delete_current_user(current_user)