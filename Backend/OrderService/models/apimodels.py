from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

class Item(BaseModel):
    IID: str = Field()
    Name: str = Field()
    Quantity: int = Field()
    Variant: str = Field()
    Price: float = Field()

class AddressInfo(BaseModel):
    RecipientName: str = Field()
    PhoneNumber: str = Field()
    AddressLine1: str = Field()
    AddressLine2: Optional[str] = Field()
    State: Optional[str] = Field()
    Zipcode: str = Field()

class Order(BaseModel):
    OID: str = Field()
    UID: str = Field()
    Items: List[Item] = Field()
    FinalPrice: float = Field()
    AddressInfo: AddressInfo = Field()
    TimeMade: str = Field()


class FoodItem(BaseModel):
    IID: str = Field()
    Name: str = Field()
    Quantity: int = Field()
    IDRequired: bool = Field()
    Price: float = Field()

class FoodOrder(BaseModel):
    OID: str = Field()
    UID: str = Field()
    Items: List[FoodItem] = Field()
    FinalPrice: float = Field()
    TimeMade: str = Field()