from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.organization import Organization
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register_user(data: RegisterRequest, db: Session):

    email = data.email.lower()
    organization_name = data.organization_name.strip()

    if not organization_name:
        raise HTTPException(
            status_code=400,
            detail="Organization name cannot be empty"
        )

    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    try:
        # Create organization
        organization = Organization(
            name=organization_name
        )

        db.add(organization)
        db.flush()

        # Create user
        user = User(
            organization_id=organization.id,
            email=email,
            password_hash=hash_password(data.password)
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration conflicts with an existing record"
        )

def login_user(data: LoginRequest, db: Session):

    email = data.email.lower()

    # Find user by email
    user = db.query(User).filter(
        User.email == email
    ).first()

    # Verify credentials
    if not user or not verify_password(
        data.password, user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate access token
    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }