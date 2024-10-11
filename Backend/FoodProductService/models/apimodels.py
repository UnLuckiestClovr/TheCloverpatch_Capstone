from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

class EdibleItem(BaseModel):
    _id: Optional[str] = Field(default='NULL_ID')
    PName: str = Field()
    IDRequired: bool = Field(default=False)
    PCost: float = Field()
    PImageURL: str = Field()