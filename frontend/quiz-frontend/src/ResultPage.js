import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { topic, quiz, score } = location.state || {};

  if (!quiz || !Array.isArray(quiz)) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No results found</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "850px", margin: "auto" }}>
      <h2>✅ Quiz Results</h2>
      <h3>Topic: {topic}</h3>
      <h3>
        Score: {score} / {quiz.length}
      </h3>

      <hr />

      {quiz.map((q, index) => {
        const hasCorrectAnswer =
          q.answer !== undefined && q.answer !== null && String(q.answer).trim() !== "";

        const isCorrect =
          hasCorrectAnswer &&
          q.userAnswer &&
          String(q.userAnswer).trim().toLowerCase() ===
            String(q.answer).trim().toLowerCase();

        return (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            <b>Q{index + 1}:</b> {q.question}
            <br />

            <p>
              <b>Your Answer:</b>{" "}
              <span style={{ color: hasCorrectAnswer ? (isCorrect ? "green" : "red") : "black" }}>
                {q.userAnswer || "(Not answered)"}
              </span>
            </p>

            <p>
              <b>Correct Answer:</b>{" "}
              <span style={{ color: "green" }}>
                {hasCorrectAnswer ? q.answer : "(Subjective / No fixed answer)"}
              </span>
            </p>
          </div>
        );
      })}

      <button onClick={() => navigate("/")}>
        ⬅ Back to Quiz Maker
      </button>

      <button
        onClick={() => navigate("/", { replace: true })}
        style={{ marginLeft: "10px" }}
      >
        🔄 Start New Quiz
      </button>
    </div>
  );
}