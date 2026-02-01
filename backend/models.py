from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class QuizHistory(Base):
    __tablename__ = "quiz_history"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(100), index=True)
    quiz_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
