from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.product import Product


def get_dashboard(organization_id: int, db: Session):

    # Total number of products
    total_products = db.query(
        func.count(Product.id)
    ).filter(
        Product.organization_id == organization_id
    ).scalar()

    # Total quantity of all products
    total_quantity = db.query(
        func.coalesce(func.sum(Product.quantity), 0)
    ).filter(
        Product.organization_id == organization_id
    ).scalar()

    # Retrieve low-stock products
    low_stock_products = db.query(Product).filter(
        Product.organization_id == organization_id,
        Product.quantity <= Product.low_stock_threshold
    ).order_by(Product.quantity.asc()).all()

    return {
        "total_products": total_products,
        "total_quantity": total_quantity,
        "low_stock_count": len(low_stock_products),
        "low_stock_products": low_stock_products
    }