import React from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Decorative background blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.wrapper}>
        {/* Left side (Brand + Features) */}
        <div style={styles.leftCard}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>📘</div>
            <div>
              <h1 style={styles.title}>Note2Quiz</h1>
              <p style={styles.subtitle}>Smart Quiz Generator</p>
            </div>
          </div>

          <p style={styles.desc}>
            Convert your notes into interactive quizzes in seconds using{" "}
            <b>OCR</b> + <b>intelligent question generation</b>.
          </p>

          <div style={styles.tagsRow}>
            <span style={styles.tag}>⚡ Fast</span>
            <span style={styles.tag}>🧠 Smart</span>
            <span style={styles.tag}>📚 Student Friendly</span>
            <span style={styles.tag}>✅ Instant Results</span>
          </div>

          <div style={styles.featureBox}>
            <h3 style={styles.featuresTitle}>✨ Key Features</h3>

            <div style={styles.featureGrid}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🖼</span>
                <div>
                  <h4 style={styles.featureHeading}>Printed OCR</h4>
                  <p style={styles.featureText}>Upload screenshots / printed notes</p>
                </div>
              </div>

              

              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📝</span>
                <div>
                  <h4 style={styles.featureHeading}>Auto Quiz</h4>
                  <p style={styles.featureText}>MCQ + Blanks + Short answers</p>
                </div>
              </div>

              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📌</span>
                <div>
                  <h4 style={styles.featureHeading}>History</h4>
                  <p style={styles.featureText}>Saved quizzes + delete anytime</p>
                </div>
              </div>
            </div>
          </div>

          <p style={styles.tip}>
            ✅ Tip: Clear images + good lighting = better OCR accuracy.
          </p>
        </div>

        {/* Right side (Call to action) */}
        <div style={styles.rightCard}>
          <div style={styles.previewBox}>
            <p style={styles.previewTitle}>📊 Quick Preview</p>

            <div style={styles.previewStatRow}>
              <div style={styles.previewStat}>
                <p style={styles.statNumber}>10</p>
                <p style={styles.statLabel}>Questions</p>
              </div>
              <div style={styles.previewStat}>
                <p style={styles.statNumber}>3</p>
                <p style={styles.statLabel}>Types</p>
              </div>
              <div style={styles.previewStat}>
                <p style={styles.statNumber}>1</p>
                <p style={styles.statLabel}>Click</p>
              </div>
            </div>

            <div style={styles.miniQuizCard}>
              <p style={styles.miniQ}>
                Q: Deep Learning is mainly based on ________ ?
              </p>
              <div style={styles.options}>
                <span style={styles.opt}>Neural networks</span>
                <span style={styles.opt}>Sorting</span>
                <span style={styles.opt}>Databases</span>
                <span style={styles.opt}>OS</span>
              </div>
            </div>
          </div>

          <button style={styles.primaryBtn} onClick={() => navigate("/home")}>
            🚀 Start Generating Quiz
          </button>

          <p style={styles.footer}>
            Built with <b>FastAPI</b> + <b>React</b> + <b>OCR</b>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eaf3ff, #fff2b3, #e6ffea)",
    padding: "20px",
  },

  blob1: {
    position: "absolute",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,85,247,0.55), transparent 70%)",
    top: "-120px",
    left: "-120px",
    filter: "blur(10px)",
  },

  blob2: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.55), transparent 70%)",
    bottom: "-150px",
    right: "-150px",
    filter: "blur(10px)",
  },

  wrapper: {
    width: "100%",
    maxWidth: "1100px",
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "20px",
    position: "relative",
    zIndex: 2,
  },

  leftCard: {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "22px",
    padding: "26px",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0px 12px 30px rgba(0,0,0,0.30)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    color: "#111",
  },

  rightCard: {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "22px",
    padding: "26px",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0px 12px 30px rgba(0,0,0,0.30)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    color: "#111",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },

  logoIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    background: "linear-gradient(135deg, rgba(168,85,247,0.9), rgba(59,130,246,0.9))",
    boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
  },

  title: {
  fontSize: "36px",
  fontWeight: 800,
  margin: 0,
  letterSpacing: "0.5px",
  color: "#000",
},

subtitle: {
  margin: 0,
  fontSize: "14px",
  color: "#333",
},

  desc: {
  marginTop: "10px",
  lineHeight: 1.7,
  color: "#222",
},

  tagsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "14px",
    marginBottom: "18px",
  },

  tag: {
  padding: "8px 12px",
  borderRadius: "999px",
  fontSize: "13px",
  background: "rgba(255,255,255,0.35)",
  border: "1px solid rgba(0,0,0,0.1)",
  color: "#111",
},

  featureBox: {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.35)",
  border: "1px solid rgba(0,0,0,0.1)",
},

  featuresTitle: {
    margin: 0,
    marginBottom: "14px",
    fontSize: "16px",
    fontWeight: 700,
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  featureItem: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  featureIcon: {
    fontSize: "20px",
  },

  featureHeading: {
  margin: 0,
  fontSize: "14px",
  fontWeight: 700,
  color: "#111",
},

  featureText: {
  margin: 0,
  fontSize: "12px",
  color: "#333",
  marginTop: "4px",
  lineHeight: 1.4,
},

  tip: {
  marginTop: "16px",
  fontSize: "13px",
  color: "#333",
},

  previewBox: {
  background: "rgba(255,255,255,0.35)",
  borderRadius: "18px",
  padding: "16px",
  border: "1px solid rgba(0,0,0,0.1)",
  marginBottom: "16px",
},

  previewTitle: {
  margin: 0,
  fontWeight: 700,
  marginBottom: "12px",
  color: "#111",
},

  previewStatRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "14px",
  },

  previewStat: {
    flex: 1,
    borderRadius: "14px",
    padding: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    textAlign: "center",
  },

  statNumber: {
  margin: 0,
  fontSize: "22px",
  fontWeight: 800,
  color: "#000",
},

  statLabel: {
  margin: 0,
  fontSize: "12px",
  color: "#444",
  marginTop: "4px",
},

  miniQuizCard: {
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

 miniQ: {
  margin: 0,
  fontSize: "13px",
  lineHeight: 1.5,
  marginBottom: "10px",
  color: "#222",
},

  options: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  opt: {
  padding: "7px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  background: "rgba(255,255,255,0.4)",
  border: "1px solid rgba(0,0,0,0.1)",
  color: "#111",
},

  primaryBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 800,
    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
    color: "white",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.35)",
    marginTop: "10px",
  },

  secondaryBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#111",
  },

  footer: {
  textAlign: "center",
  marginTop: "12px",
  fontSize: "12px",
  color: "#444",
},
};