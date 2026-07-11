from app.schemas.auth import RefreshTokenRequest, UpdateUser
from app.api.dependencies import CurrentUserDep, UserServiceDep
from app.schemas.auth import UserRead, CreateUser
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth/v1", tags=["Authentication"])

@router.post("/signup", response_model=UserRead)
async def signup(credentials : CreateUser, service : UserServiceDep):
    return await service.create(credentials)

@router.post("/login")
async def login(service : UserServiceDep, form : OAuth2PasswordRequestForm = Depends()):
    return await service.login(form.username, form.password)

@router.get("/me", response_model=UserRead)
async def current_user(user : CurrentUserDep):
    return user

@router.put("/me", response_model=UserRead)
async def update_user(data: UpdateUser, user: CurrentUserDep, service: UserServiceDep):
    return await service.update_user(user, data)

@router.delete("/me", status_code=204)
async def delete_user(user: CurrentUserDep, service: UserServiceDep):
    await service.delete_user(user)

@router.post("/refresh")
async def refresh_token(request : RefreshTokenRequest, service: UserServiceDep):
    return await service.refresh_token(request.refresh_token)

@router.post("/logout")
async def logout(request : RefreshTokenRequest, service: UserServiceDep):
    return await service.logout(request.refresh_token)