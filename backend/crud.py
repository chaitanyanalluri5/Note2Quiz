from sqlalchemy.orm import Session
from typing import Optional
from models import QuizHistory
import json

def save_quiz(db: Session, topic: str, quiz):
    new_item = QuizHistory(
        topic=topic,
        quiz_json=json.dumps(quiz)
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def get_history(db: Session, topic: Optional[str] = None):
    q = db.query(QuizHistory)
    if topic:
        q = q.filter(QuizHistory.topic == topic)
    return q.order_by(QuizHistory.created_at.desc()).all()
