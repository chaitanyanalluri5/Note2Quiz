from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class QuizHistoryCreate(BaseModel):
    topic: Optional[str] = "General"
    quiz: Any  # quiz list/dict

class QuizHistoryOut(BaseModel):
    id: int
    topic: str
    quiz_json: str
    created_at: datetime

    class Config:
        from_attributes = True
