from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

class AddressInfo(BaseModel):
    AddressLine1: str = Field()
    AddressLine2: Optional[str] = Field()
    Country: str = Field()
    State: Optional[str] = Field()
    Zipcode: str = Field()

class OrderItem(BaseModel):
    IID: str = Field()
    ItemName: str = Field()
    ItemVariant: str = Field()
    ItemQuantity: int = Field()
    Price: float = Field()

class Order(BaseModel):
    UID: str = Field()
    Items: List[OrderItem] = Field()
    FinalPrice: float = Field()

class FlowerOrder(BaseModel):
    UID: str = Field()
    Items: List[OrderItem] = Field()
    FinalPrice: float = Field()
    AddressInfo: AddressInfo = Field()