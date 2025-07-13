# backend/app/models.py
from pydantic import BaseModel
from typing import List

class Architecture(BaseModel):
    title: str
    description: str
    resources: List[str]
    source_url: str  # Should be unique
    timestamp: str
    page: int = None  # Optional, can be used to track pagination
