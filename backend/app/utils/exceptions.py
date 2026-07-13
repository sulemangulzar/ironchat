from fastapi import HTTPException, status


class UserAlreadyExists(HTTPException):
    def __init__(self, detail: str = "User with this email already exists"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class LoginException(HTTPException):
    def __init__(self, detail: str = "Invalid Email or Password"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class InvalidToken(HTTPException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class ChatNotFound(HTTPException):
    def __init__(self, detail: str = "Chat not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class UserNotFound(HTTPException):
    def __init__(self, detail: str = "User not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)