from fastapi import HTTPException, status


class UserAlreadyExists(HTTPException):
    def __init__(self, detail: str = "User with this email already exists"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)