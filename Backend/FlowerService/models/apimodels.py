from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class FlowerProduct(BaseModel):
    _id: Optional[str] = Field()
    PName: str = Field()
    PMonth: int = Field()
    PCostPerFlower: float = Field()
    PImageURL: str = Field()