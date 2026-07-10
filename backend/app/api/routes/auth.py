from app.api.dependencies import UserServiceDep, CurrentUserDep
from app.schemas.auth import CreateUser, LoginRequest, Token, RefreshTokenRequest, UserRead, UpdateUser
from app.core.security import create_access_token, create_refresh_token, decode_token
from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/auth/v1", tags=["auth"])

@router.post("/signup", response_model=UserRead)
async def signup(credentials : CreateUser, service : UserServiceDep):
    return await service.create(credentials)

@router.post("/login", response_model=Token)
async def login(credentials: LoginRequest, service: UserServiceDep):
    user = await service.authenticate_user(credentials)
    
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

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