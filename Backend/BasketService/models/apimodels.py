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

class Basket(BaseModel):
    BID: str = Field()
    Items: List[Item]
    TotalPrice: float = Field()


class FoodItem(BaseModel):
    IID: str = Field()
    Name: str = Field()
    Quantity: int = Field()
    IDRequired: bool = Field()
    Price: float = Field()

class FoodBasket(BaseModel):
    BID: str = Field()
    Items: List[FoodItem]
    TotalPrice: float = Field()