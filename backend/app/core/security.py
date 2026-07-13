import hashlib
import hmac

import jwt
from pwdlib import PasswordHash

from app.core.config import settings
from datetime import timedelta, timezone, datetime

pwd_context = PasswordHash.recommended()

# Slow hash — bcrypt/argon2, used only for user passwords
def get_hash(secret: str) -> str:
    return pwd_context.hash(secret)

def verify_hash(secret: str, hashed_secret: str) -> bool:
    return pwd_context.verify(secret, hashed_secret)

# Fast hash — SHA-256, used for refresh tokens (already high-entropy random strings)
def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def verify_token_hash(token: str, token_hash: str) -> bool:
    return hmac.compare_digest(hash_token(token), token_hash)




def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.PyJWTError:
        return None