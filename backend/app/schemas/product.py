from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ProductCreate(BaseModel):

    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None
    quantity: int = Field(default=0, ge=0)
    cost_price: Decimal = Field(
        ge=0, max_digits=12, decimal_places=2
    )
    selling_price: Decimal = Field(
        ge=0, max_digits=12, decimal_places=2
    )
    low_stock_threshold: int = Field(default=5, ge=0)


class ProductUpdate(ProductCreate):
    pass


class ProductResponse(ProductCreate):

    id: int
    organization_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)