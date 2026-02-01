from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
import random
import re
from typing import List, Optional
import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import QuizHistory



app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


nlp = spacy.load("en_core_web_sm")

# ✅ Create tables properly
Base.metadata.create_all(bind=engine)


# ✅ DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Quiz API running!"}


# ✅ Added topic
class NotesInput(BaseModel):
    text: Optional[str] = ""
    topic: Optional[str] = "General"


# ---------- LIMITS ----------
MAX_TOTAL = 10
MAX_MCQ = 4
MAX_BLANK = 3
MAX_SHORT = 3

# ✅ NEW: protect server from hanging on large OCR text
MAX_TEXT_CHARS = 4000
MAX_SENTENCES_TO_PROCESS = 25


# ---------- CLEAN OCR TEXT ----------
def clean_ocr_text(text: str):
    text = text.replace("\n", " ")
    text = re.sub(r"[|_•■]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ---------- SPLIT OCR INTO SENTENCES ----------
def split_ocr_sentences(text: str):
    text = clean_ocr_text(text)

    # split on proper sentence boundaries
    parts = re.split(r"(?<=[.!?])\s+", text)

    # also split long lines further by ; :
    final = []
    for p in parts:
        subparts = re.split(r"[;:]\s+", p)
        for s in subparts:
            s = s.strip()
            if len(s) >= 25:
                final.append(s)

    return final


# ---------- FILTER BAD SENTENCES ----------
def is_valid_sentence(text: str):
    text = text.strip()

    if len(text) < 20:
        return False

    if len(text.split()) < 5:
        return False

    alpha_ratio = sum(c.isalpha() for c in text) / max(len(text), 1)
    if alpha_ratio < 0.5:
        return False

    # ✅ FAST verb check (no spaCy)
    common_verbs = ["is", "are", "was", "were", "has", "have", "used", "focuses", "allows", "helps", "learn", "improve"]
    if not any(v in text.lower().split() for v in common_verbs):
        return False

    return True

# ---------- FILL IN THE BLANK ----------
def make_fill_blank(sentence: str):
    # pick a long word (5+ letters) as blank
    words = re.findall(r"[A-Za-z]{5,}", sentence)

    # remove common junk words
    stop = {"these", "those", "their", "about", "which", "there", "where", "would", "could", "should"}
    words = [w for w in words if w.lower() not in stop]

    if not words:
        return None

    answer = random.choice(words)
    blank_sentence = re.sub(rf"\b{re.escape(answer)}\b", "_____", sentence, count=1)

    if len(blank_sentence.split()) < 6:
        return None

    return {
        "type": "blank",
        "question": f"Fill in the blank:\n{blank_sentence}",
        "answer": answer
    }


# ---------- TOPIC MCQs ----------
def make_mcq(sentence):
    s = sentence.lower()

    if "convolutional neural" in s or "cnn" in s:
        return {
            "type": "mcq",
            "question": "What are Convolutional Neural Networks (CNNs) mainly used for?",
            "options": ["Image recognition", "Speech synthesis", "Text translation", "Database indexing"],
            "answer": "Image recognition"
        }

    if "machine learning" in s:
        return {
            "type": "mcq",
            "question": "What is the goal of Machine Learning?",
            "options": ["Learning patterns from data", "Designing websites", "Cooking food", "Deleting files"],
            "answer": "Learning patterns from data"
        }

    if "deep learning" in s:
        return {
            "type": "mcq",
            "question": "Deep Learning is mainly based on:",
            "options": ["Neural networks", "Sorting algorithms", "Relational databases", "Operating systems"],
            "answer": "Neural networks"
        }

    if "artificial intelligence" in s or " ai " in f" {s} ":
        return {
            "type": "mcq",
            "question": "Artificial Intelligence (AI) mainly focuses on:",
            "options": [
                "Making machines perform intelligent tasks",
                "Only storing data",
                "Only printing documents",
                "Only playing games"
            ],
            "answer": "Making machines perform intelligent tasks"
        }

    if "privacy" in s or "bias" in s or "ethical" in s:
        return {
            "type": "mcq",
            "question": "Which of these is a major ethical issue in AI?",
            "options": ["Data privacy and bias", "High screen brightness", "Keyboard layout", "Battery percentage"],
            "answer": "Data privacy and bias"
        }

    if "data" in s:
        return {
            "type": "mcq",
            "question": "Why is data important in AI systems?",
            "options": [
                "It helps models learn effectively",
                "It deletes programs automatically",
                "It increases computer weight",
                "It slows down the CPU"
            ],
            "answer": "It helps models learn effectively"
        }

    return None


# ---------- SHORT QUESTION ----------
def make_short(sentence):
    return {
        "type": "short",
        "question": f"Write a short explanation:\n{sentence}",
        "answer": sentence
    }


# ---------- MAIN QUIZ ENDPOINT ----------
@app.post("/generate-quiz")
def generate_quiz(data: NotesInput, db: Session = Depends(get_db)):
    print("✅ generate-quiz hit")

    # ✅ PROTECTION: avoid huge OCR text hanging backend
    text = (data.text or "").strip()
    if len(text) < 5:
        return {"quiz": []}

    if len(text) > MAX_TEXT_CHARS:
        text = text[:MAX_TEXT_CHARS]

    topic = (data.topic or "General").strip()
    if not topic:
        topic = "General"

    sentences = split_ocr_sentences(text)
    sentences = sentences[:30]   # ✅ process only first 30 sentences

    # ✅ limit sentence processing (fast)
    sentences = sentences[:MAX_SENTENCES_TO_PROCESS]

    questions = []
    seen = set()
    used_answers = set()

    mcq_count = blank_count = short_count = 0

    for sentence in sentences:
        if len(questions) >= MAX_TOTAL:
            break

        sentence = sentence.strip()
        if not is_valid_sentence(sentence):
            continue

        generated = False

        # MCQ
        if mcq_count < MAX_MCQ:
            q = make_mcq(sentence)
            if q:
                key = q["type"] + "|" + q["question"].lower().strip()
                ans_key = q["type"] + "|" + str(q.get("answer", "")).lower().strip()

                if key not in seen and ans_key not in used_answers:
                    seen.add(key)
                    used_answers.add(ans_key)
                    questions.append(q)
                    mcq_count += 1
                    generated = True

        # Blank
        if not generated and blank_count < MAX_BLANK:
            q = make_fill_blank(sentence)
            if q and len(q["question"]) >= 35:
                key = q["type"] + "|" + q["question"].lower().strip()
                ans_key = q["type"] + "|" + str(q.get("answer", "")).lower().strip()

                if key not in seen and ans_key not in used_answers:
                    seen.add(key)
                    used_answers.add(ans_key)
                    questions.append(q)
                    blank_count += 1
                    generated = True

        # Short
        if not generated and short_count < MAX_SHORT:
            q = make_short(sentence)
            key = q["type"] + "|" + q["question"].lower().strip()

            if key not in seen:
                seen.add(key)
                questions.append(q)
                short_count += 1
                generated = True  # ✅ FIXED

    # fallback to fill remaining
    fallback_pool = [
        "Explain one important concept from the notes.",
        "Write one real-world application of the topic.",
        "What is one advantage of this concept?",
        "What is one limitation or challenge of this concept?",
        "Give one example based on the notes."
    ]

    i = 0
    while len(questions) < MAX_TOTAL:
        qtext = fallback_pool[i % len(fallback_pool)]
        key = "short|" + qtext.lower()

        if key not in seen:
            seen.add(key)
            questions.append({"type": "short", "question": qtext, "answer": ""})
        i += 1

    # ✅ SAVE QUIZ TO DB
    record = QuizHistory(
        topic=topic,
        quiz_json=json.dumps(questions)
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {"quiz": questions, "saved_id": record.id}


# ✅ HISTORY API (GET ALL or BY TOPIC)
@app.get("/history")
def get_history(topic: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(QuizHistory)

    if topic:
        query = query.filter(QuizHistory.topic == topic)

    items = query.order_by(QuizHistory.created_at.desc()).limit(50).all()

    history_data = []
    for item in items:
        history_data.append({
            "id": item.id,
            "topic": item.topic,
            "created_at": item.created_at.isoformat(),
            "quiz": json.loads(str(item.quiz_json))
        })

    return {"history": history_data}


# ✅ DELETE HISTORY RECORD
@app.delete("/history/{quiz_id}")
def delete_history(quiz_id: int, db: Session = Depends(get_db)):
    item = db.query(QuizHistory).filter(QuizHistory.id == quiz_id).first()

    if not item:
        return {"message": "Not found"}

    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}


# ---------- MULTI-IMAGE OCR ----------
@app.post("/extract-text")
async def extract_text(files: Optional[List[UploadFile]] = File(None)):
    if not files:
        return {"text": ""}

    import easyocr
    import numpy as np
    import cv2

    reader = easyocr.Reader(["en"], gpu=False)
    all_text = []

    for file in files:
        image_bytes = await file.read()
        if not image_bytes:
            continue

        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            continue

        result = reader.readtext(img, detail=0)
        all_text.append(" ".join(str(text) for text in result))

    return {"text": "\n".join(all_text).strip()}


