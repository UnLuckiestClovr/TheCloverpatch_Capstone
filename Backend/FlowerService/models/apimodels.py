from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

def FlowerProduct(BaseModel):
    PID: str = Field()
    PName: str = Field()
    PMonth: int = Field()
    PCostPerFlower: float = Field()
    PImageURL: str = Field()