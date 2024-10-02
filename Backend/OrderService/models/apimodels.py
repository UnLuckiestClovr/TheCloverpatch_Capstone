from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

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