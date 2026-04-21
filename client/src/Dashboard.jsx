import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "./DarkModeContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [streak, setStreak] = useState(0);
  const [streakMessage, setStreakMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/auth"); return; }
    setUser(JSON.parse(stored));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("good morning,");
    else if (hour < 17) setGreeting("good afternoon,");
    else setGreeting("good evening,");

    // ── Streak logic ──
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("lastVisit");
    const currentStreak = parseInt(localStorage.getItem("streak") || "0");

    if (lastVisit === today) {
      // Already visited today, just load streak
      setStreak(currentStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastVisit === yesterday.toDateString()) {
        // Visited yesterday → extend streak
        const newStreak = currentStreak + 1;
        localStorage.setItem("streak", newStreak);
        localStorage.setItem("lastVisit", today);
        setStreak(newStreak);
      } else {
        // Streak broken
        localStorage.setItem("streak", 1);
        localStorage.setItem("lastVisit", today);
        setStreak(1);
      }
    }

    // Streak message
    const s = parseInt(localStorage.getItem("streak") || "1");
    if (s >= 30) setStreakMessage("legendary! 🏆");
    else if (s >= 14) setStreakMessage("on fire! 🔥");
    else if (s >= 7) setStreakMessage("amazing! ⚡");
    else if (s >= 3) setStreakMessage("keep going! 💪");
    else setStreakMessage("just started! 🌱");

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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="dash-logout"
            onClick={() => setDarkMode(!darkMode)}
            style={{ fontSize: "1.1rem", padding: "8px 14px" }}
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="dash-logout" onClick={handleLogout}>sign out</button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-greeting">
          <span className="dash-greet-text">{greeting}</span>
          <span className="dash-greet-name">{firstName} ✨</span>
          <p className="dash-greet-sub">how are you feeling today?</p>
        </div>

        {/* ── Streak Banner ── */}
        <div className="streak-banner">
          <div className="streak-left">
            <span className="streak-fire">🔥</span>
            <div>
              <p className="streak-count">{streak} day streak</p>
              <p className="streak-msg">{streakMessage}</p>
            </div>
          </div>
          <div className="streak-dots">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`streak-dot ${i < Math.min(streak, 7) ? "active" : ""}`}
              />
            ))}
          </div>
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
