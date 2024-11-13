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
    AddressLine1: str = Field()
    AddressLine2: Optional[str] = Field()
    Country: str = Field()
    State: Optional[str] = Field()
    Zipcode: str = Field()

class Order(BaseModel):
    OID: str = Field()
    UID: str = Field()
    Items: List[Item] = Field()
    FinalPrice: float = Field()
    AddressInfo: AddressInfo = Field()
    TimeMade: str = Field()