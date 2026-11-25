from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


# Create a product
def create_product(
    data: ProductCreate,
    organization_id: int,
    db: Session
):
    existing_product = db.query(Product).filter(
        Product.organization_id == organization_id,
        Product.sku == data.sku
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=409,
            detail="Product with this SKU already exists"
        )

    product = Product(
        organization_id=organization_id,
        **data.model_dump()
    )

    try:
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Product conflicts with an existing record"
        )


# Get all products
def get_products(
    organization_id: int,
    db: Session
):
    return db.query(Product).filter(
        Product.organization_id == organization_id
    ).order_by(Product.id.desc()).all()


# Get a single product
def get_product(
    product_id: int,
    organization_id: int,
    db: Session
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.organization_id == organization_id
    ).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# Update a product
def update_product(
    product_id: int,
    data: ProductUpdate,
    organization_id: int,
    db: Session
):
    product = get_product(
        product_id, organization_id, db
    )

    existing_product = db.query(Product).filter(
        Product.organization_id == organization_id,
        Product.sku == data.sku,
        Product.id != product_id
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=409,
            detail="Product with this SKU already exists"
        )

    for key, value in data.model_dump().items():
        setattr(product, key, value)

    try:
        db.commit()
        db.refresh(product)
        return product

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Product conflicts with an existing record"
        )


# Delete a product
def delete_product(
    product_id: int,
    organization_id: int,
    db: Session
):
    product = get_product(
        product_id, organization_id, db
    )

    db.delete(product)
    db.commit()