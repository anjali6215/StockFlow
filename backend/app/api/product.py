from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)

from app.services.product_service import (
    create_product,
    get_products,
    get_product,
    update_product,
    delete_product
)


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# Create product
@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def create(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_product(
        data, current_user.organization_id, db
    )


# Get all products
@router.get("", response_model=list[ProductResponse])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_products(
        current_user.organization_id, db
    )


# Get single product
@router.get("/{product_id}", response_model=ProductResponse)
def get_one(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_product(
        product_id, current_user.organization_id, db
    )


# Update product
@router.put("/{product_id}", response_model=ProductResponse)
def update(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_product(
        product_id, data,
        current_user.organization_id, db
    )


# Delete product
@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    delete_product(
        product_id, current_user.organization_id, db
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )