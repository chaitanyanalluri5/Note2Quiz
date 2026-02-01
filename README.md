# 📘 Note2Quiz – Smart Quiz Generator

Note2Quiz is a full-stack web application that converts **printed or handwritten notes** into **interactive quizzes** using OCR and intelligent question generation.  
It helps students quickly revise concepts by transforming notes into **MCQs, fill-in-the-blanks, and short-answer questions**.

---

## ✨ Features

- 🖼 Upload printed notes / screenshots (OCR)
- ✍ Extract handwritten notes using PaddleOCR
- ⚡ Automatically generate quizzes from notes
- 📝 Question types:
  - Multiple Choice Questions (MCQs)
  - Fill in the Blanks
  - Short Answer Questions
- 📊 Submit quiz and view score
- 📚 Save quizzes and view quiz history
- 🗑 Delete saved quizzes anytime
- 🎨 Clean and user-friendly UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- CSS

### Backend
- FastAPI
- PaddleOCR (for handwritten text)
- EasyOCR (for printed text)
- SQLite + SQLAlchemy

---


---

## ⚙️ Installation & Setup

###  Clone the Repository

```bash
git clone https://github.com/chaitanyanalluri5/Note2Quiz.git
cd Note2Quiz
```
### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```
### Frontend Setup 
```bash
cd frontend/quiz-frontend
npm install
npm start
```

## 🚀 How It Works

1. User uploads printed notes, screenshots, or handwritten notes as images.
2. OCR engine extracts text from the uploaded images:
   - Printed text → EasyOCR
   - Handwritten text → PaddleOCR
3. Extracted text is cleaned and processed.
4. Intelligent logic generates quiz questions from the notes:
   - Multiple Choice Questions (MCQs)
   - Fill in the Blanks
   - Short Answer Questions
5. User attempts the quiz and submits answers.
6. System evaluates responses and displays the score.
7. Quiz and results are saved and can be viewed later in Quiz History.

---

## 📸 OCR Accuracy Notes

- OCR accuracy depends heavily on image quality.
- For best results:
  - Use clear, high-resolution images
  - Ensure proper lighting
  - Avoid shadows and blurred images
  - Keep text straight and readable
- Printed text generally gives higher accuracy than handwritten text.
- Handwritten OCR accuracy varies based on handwriting style.
- **100% OCR accuracy is not guaranteed**, as OCR technology has practical limitations.

---

## 🔮 Future Enhancements

- Improve handwritten text recognition accuracy
- Support PDF document uploads
- Add difficulty levels for quizzes
- AI-based question quality enhancement
- Analytics for performance tracking
---

