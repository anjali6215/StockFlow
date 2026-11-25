from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.core.config import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

password_hasher = PasswordHash.recommended()


# Hash password
def hash_password(password: str) -> str:
    return password_hasher.hash(password)


# Verify password
def verify_password(password: str, hashed_password: str) -> bool:
    return password_hasher.verify(password, hashed_password)


# Generate access token
def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
        "type": "access"
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


# Decode and validate access token
def decode_access_token(token: str) -> dict:
    payload = jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM],
        options={"require": ["sub", "exp", "type"]}
    )

    if payload["type"] != "access":
        raise jwt.InvalidTokenError("Invalid token type")

    return payload