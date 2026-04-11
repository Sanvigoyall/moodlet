import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Journal.css";

const API = "http://localhost:5001/api/entries";

const MOODS = [
  { value: "", label: "Select Mood" },
  { value: "happy", label: "😊 Happy", color: "#fef9c3", border: "#fde68a", text: "#854d0e" },
  { value: "sad", label: "😔 Sad", color: "#dbeafe", border: "#bfdbfe", text: "#1e40af" },
  { value: "anxious", label: "😰 Anxious", color: "#fee2e2", border: "#fecaca", text: "#991b1b" },
  { value: "calm", label: "😌 Calm", color: "#dcfce7", border: "#bbf7d0", text: "#14532d" },
  { value: "excited", label: "🌟 Excited", color: "#ffedd5", border: "#fed7aa", text: "#7c2d12" },
  { value: "tired", label: "😴 Tired", color: "#f3f4f6", border: "#e5e7eb", text: "#4b5563" },
  { value: "grateful", label: "🥰 Grateful", color: "#fdf2f8", border: "#fbcfe8", text: "#831843" },
  { value: "stressed", label: "😤 Stressed", color: "#fff1f2", border: "#fecdd3", text: "#9f1239" },
  { value: "hopeful", label: "🌤️ Hopeful", color: "#f0f9ff", border: "#bae6fd", text: "#0c4a6e" },
  { value: "numb", label: "😶 Numb", color: "#fafafa", border: "#e5e7eb", text: "#6b7280" },
];

function Journal() {
  const navigate = useNavigate();
  const [mood, setMood] = useState("");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [moodError, setMoodError] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "you";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) { navigate("/auth"); return; }
    fetchEntries();
  }, [navigate]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setEntries(data.entries);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMoodData = (val) => MOODS.find((m) => m.value === val) || MOODS[0];

  const handleSave = async () => {
    if (!text.trim()) return;

    if (!mood) {
      setMoodError(true);
      setTimeout(() => setMoodError(false), 2000);
      return;
    }

    setSaving(true);
    const moodData = getMoodData(mood);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood,
          moodLabel: moodData.label,
          color: moodData.color,
          border: moodData.border,
          textColor: moodData.text,
          text: text.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEntries((prev) => [data.entry, ...prev]);
        setText("");
        setMood("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEntries((prev) => prev.filter((e) => e._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="journal-root">
      <button className="journal-back" onClick={() => navigate("/dashboard")}>
        ← back
      </button>

      <div className="journal-card">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "'Lora', serif",
            fontSize: "2rem",
            fontWeight: "700",
            fontStyle: "italic",
            color: "#6c63b6",
            margin: "0 0 8px 0",
            textAlign: "center",
            display: "block",
          }}>
            Moodlet Journal 🌸
          </h1>
          <p style={{
            fontSize: "0.95rem",
            color: "#9ca3af",
            fontWeight: "600",
            margin: 0,
            textAlign: "center",
          }}>
            Capture your thoughts and emotions
          </p>
        </div>

        <select
          className={`journal-select ${moodError ? "mood-error" : ""}`}
          value={mood}
          onChange={(e) => { setMood(e.target.value); setMoodError(false); }}
        >
          {MOODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        {moodError && (
          <p className="mood-error-msg">⚠️ please select a mood before saving!</p>
        )}

        <textarea
          className="journal-textarea"
          placeholder="Write your thoughts here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className={`journal-save-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
          disabled={saving || !text.trim()}
        >
          {saved ? "Saved! ✓" : saving ? "Saving..." : "Save Entry"}
        </button>
      </div>

      {/* Entries */}
      <div className="journal-entries">
        {loading && (
          <p style={{ textAlign: "center", color: "#9ca3af", fontWeight: 600 }}>
            loading your entries...
          </p>
        )}
        {!loading && entries.length === 0 && (
          <p style={{ textAlign: "center", color: "#9ca3af", fontWeight: 600 }}>
            no entries yet — write your first one! 🌸
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="journal-entry"
            style={{
              background: entry.color || "#f5f3ff",
              borderLeft: `4px solid ${entry.border || "#a78bfa"}`,
            }}
          >
            <div className="entry-top">
              <span className="entry-mood-label" style={{ color: entry.textColor }}>
                {entry.moodLabel || "📝"}
              </span>
              <span className="entry-name" style={{ color: entry.textColor }}>
                {userName}
              </span>
              <span className="entry-date">{formatDate(entry.createdAt)}</span>
              <button
                className="entry-delete"
                onClick={() => handleDelete(entry._id)}
                title="Delete entry"
              >
                🗑️
              </button>
            </div>
            <p className="entry-text" style={{ color: entry.textColor }}>
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Journal;
