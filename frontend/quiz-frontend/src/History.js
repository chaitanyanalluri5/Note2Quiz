import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const [topicFilter, setTopicFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = "https://note2quiz-wgsv.onrender.com";

  const loadHistory = async () => {
    setLoading(true);

    try {
      let url = `${API_BASE}/history`;
      if (topicFilter.trim()) {
        url += `?topic=${encodeURIComponent(topicFilter.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load history!");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (id) => {
    const ok = window.confirm("Delete this quiz history permanently?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/history/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadHistory();
      } else {
        alert("Delete failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="title">📌 Quiz History</h1>
            <p className="subtitle">
              View previously generated quizzes (topic-wise) and re-open results.
            </p>
          </div>

          <button className="btn btn-outline" onClick={() => navigate("/")}>
            ⬅ Back
          </button>
        </div>

        {/* Filter */}
        <div className="card">
          <h2 className="cardTitle">Search History</h2>

          <div className="row">
            <input
              className="input"
              type="text"
              placeholder="Filter by topic (optional)"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            />

            <button className="btn btn-primary" onClick={loadHistory}>
              🔍 Search
            </button>
          </div>

          <p style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
            Total Saved Quizzes: <b>{history.length}</b>
          </p>
        </div>

        {/* History List */}
        <div className="card" style={{ marginTop: "18px" }}>
          <h2 className="cardTitle">
            Saved Quizzes <span className="pill">{history.length}</span>
          </h2>

          {loading && <p className="empty">Loading...</p>}

          {!loading && history.length === 0 && (
            <p className="empty">No history found.</p>
          )}

          {!loading &&
            history.map((item) => (
              <div key={item.id} className="questionCard">
                <div className="qHead">
                  <span className="qNo">{item.topic}</span>
                  <span className="qType">ID: {item.id}</span>
                </div>

                <p style={{ margin: "8px 0", color: "#444", fontSize: "14px" }}>
                  <b>Created:</b> {item.created_at}
                </p>

                <p style={{ margin: "0 0 10px", color: "#444", fontSize: "14px" }}>
                  <b>Questions:</b> {item.quiz?.length || 0}
                </p>

                <div className="row">
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate("/result", {
                        state: {
                          topic: item.topic,
                          quiz: item.quiz,
                          score: 0,
                        },
                      })
                    }
                  >
                    ✅ View Quiz
                  </button>

                  <button
                    className="btn btn-outline"
                    style={{ borderColor: "#f87171", color: "#b91c1c" }}
                    onClick={() => deleteHistory(item.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
