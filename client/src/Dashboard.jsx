import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/auth"); return; }
    setUser(JSON.parse(stored));
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("good morning,");
    else if (hour < 17) setGreeting("good afternoon,");
    else setGreeting("good evening,");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const firstName = user?.name?.split(" ")[0] || "friend";

  const moods = [
    "😴 tired", "😊 good", "🌟 amazing", "😔 low",
    "😤 stressed", "🌈 happy", "🥰 loved", "😶 numb"
  ];

  return (
    <div className="dash-root">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      <header className="dash-header">
        <div className="dash-logo">🌿 moodlet</div>
        <button className="dash-logout" onClick={handleLogout}>sign out</button>
      </header>

      <main className="dash-main">
        <div className="dash-greeting">
          <span className="dash-greet-text">{greeting}</span>
          <span className="dash-greet-name">{firstName} ✨</span>
          <p className="dash-greet-sub">how are you feeling today?</p>
        </div>

        <div className="dash-cards">

          {/* Journal card */}
          <div className="dash-card card-journal" onClick={() => navigate("/journal")}>
            <div className="card-illus">
              <div className="book-wrap">
                <span className="book-star">⭐</span>
                <span className="book-heart">💗</span>
                <div className="book-cover">
                  <div className="book-spine" />
                  <div className="book-p3" />
                  <div className="book-p2" />
                  <div className="book-p1" />
                  <div className="book-face">
                    <div className="book-eyes">
                      <div className="book-eye" />
                      <div className="book-eye" />
                    </div>
                    <div className="book-smile" />
                    <div className="book-blush">
                      <div className="book-blush-dot" />
                      <div className="book-blush-dot" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-text">
              <h2 className="card-title">start journaling</h2>
              <p className="card-sub">pour your heart onto the page 🌸</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          {/* Moody card */}
          <div className="dash-card card-moody" onClick={() => navigate("/chat")}>
            <div className="card-illus">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div className="moody-wrap" style={{ position: "relative" }}>
                  <span className="moody-star-1">✦</span>
                  <span className="moody-star-2">✦</span>
                  <div className="moody-head">
                    <div className="moody-ears">
                      <div className="moody-ear left" />
                      <div className="moody-ear right" />
                    </div>
                    <div className="moody-antenna">
                      <div className="moody-antenna-stem" />
                      <div className="moody-antenna-tip" />
                    </div>
                    <div className="moody-eyes">
                      <div className="moody-eye" />
                      <div className="moody-eye" />
                    </div>
                    <div className="moody-smile" />
                    <div className="moody-blush">
                      <div className="moody-blush-dot" />
                      <div className="moody-blush-dot" />
                    </div>
                  </div>
                </div>
                <div className="moody-bubble">wanna talk? 💜</div>
              </div>
            </div>
            <div className="card-text">
              <h2 className="card-title">hey, i'm moody!</h2>
              <p className="card-sub">your cozy AI companion 🌙</p>
            </div>
            <div className="card-arrow">→</div>
          </div>

        </div>

        {/* Mood check-in */}
        <div className="dash-mood-section">
          <p className="mood-label">today's mood check-in</p>
          <div className="mood-pills">
            {moods.map((mood) => (
              <button
                key={mood}
                className={`mood-pill ${selectedMood === mood ? "selected" : ""}`}
                onClick={() => setSelectedMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
