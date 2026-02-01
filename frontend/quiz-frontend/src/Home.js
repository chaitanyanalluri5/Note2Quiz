import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [text, setText] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [topic, setTopic] = useState("");
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const API_BASE = "https://note2quiz-wgsv.onrender.com";
  const navigate = useNavigate();

  // ---------- FILE UPLOAD ----------
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  // ---------- OCR ----------
  const handleImageUpload = async () => {
    if (!files.length) return alert("Upload images first!");

    setLoadingOCR(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch(`${API_BASE}/extract-text`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setText(data.text || "");
    } finally {
      setLoadingOCR(false);
    }
  };

  

  // ---------- QUIZ ----------
  const generateQuiz = async () => {
    if (!text.trim()) return alert("Enter notes first!");

    setLoadingQuiz(true);
    try {
      const res = await fetch(`${API_BASE}/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, topic }),
      });

      const data = await res.json();
      setQuiz(data.quiz.map((q) => ({ ...q, userAnswer: "" })));
    } finally {
      setLoadingQuiz(false);
    }
  };

  const updateAnswer = (index, value) => {
    setQuiz((prev) =>
      prev.map((q, i) => (i === index ? { ...q, userAnswer: value } : q))
    );
  };

  const submitQuiz = () => navigate("/result", { state: { quiz, topic } });

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div>
            <h1 className="title">AI Quiz Maker</h1>
            <p className="subtitle">
              Upload screenshots or paste notes → generate quiz → submit → see results.
            </p>
          </div>

          <button className="btn btn-outline" onClick={() => navigate("/history")}>
            📚 View History
          </button>
        </div>

        {/* ✅ TWO COLUMN LAYOUT */}
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          
          {/* LEFT: INPUT */}
          <div className="card">
            <h2 className="cardTitle">Input Notes</h2>

            <label className="label">Topic</label>
            <input
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <label className="label">Notes</label>
            <textarea
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <input
              className="file"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />

            {files.length > 0 && (
              <>
                <p style={{ color: "green", marginTop: "8px" }}>
                  ✅ {files.length} image(s) uploaded
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {previews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="preview"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="row">
              <button
  className="btn btn-outline"
  onClick={handleImageUpload}
  disabled={loadingOCR}
>
  {loadingOCR ? "Extracting..." : "🖼 Extract Printed Notes"}
</button>


            </div>

            <div className="row">
              <button
  className="btn btn-primary"
  onClick={generateQuiz}
  disabled={loadingQuiz}
>
  {loadingQuiz ? "Generating..." : "⚡ Generate Quiz"}
</button>
              <button
                className="btn btn-success"
                onClick={submitQuiz}
                disabled={!quiz.length}
              >
                ✅ Submit → Results
              </button>
            </div>
          </div>

          {/* RIGHT: QUIZ */}
          <div className="card">
            <h2 className="cardTitle">Generated Quiz</h2>

            {quiz.length === 0 ? (
              <p style={{ opacity: 0.6 }}>
                Quiz will appear here after generation
              </p>
            ) : (
              quiz.map((q, index) => (
                <div key={index} className="question-answer">
                  <label className="label">{q.question}</label>

                  {q.type === "mcq" ? (
                    q.options.map((opt, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name={`q-${index}`}
                          value={opt}
                          checked={q.userAnswer === opt}
                          onChange={(e) => updateAnswer(index, e.target.value)}
                        />
                        {opt}
                      </label>
                    ))
                  ) : (
                    <input
                      className="input"
                      value={q.userAnswer}
                      onChange={(e) => updateAnswer(index, e.target.value)}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
