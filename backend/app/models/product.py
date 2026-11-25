from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
    func
)

from app.database.connection import Base


class Product(Base):
    __tablename__ = "products"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "sku",
            name="uq_organization_sku"
        ),
        CheckConstraint("quantity >= 0"),
        CheckConstraint("cost_price >= 0"),
        CheckConstraint("selling_price >= 0"),
        CheckConstraint("low_stock_threshold >= 0"),
    )

    id = Column(Integer, primary_key=True)

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id"),
        nullable=False,
        index=True
    )

    name = Column(String(255), nullable=False)

    sku = Column(String(100), nullable=False)

    description = Column(Text, nullable=True)

    quantity = Column(
        Integer,
        default=0,
        nullable=False
    )

    cost_price = Column(Numeric(12, 2), nullable=False)

    selling_price = Column(Numeric(12, 2), nullable=False)

    low_stock_threshold = Column(
        Integer,
        default=5,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    