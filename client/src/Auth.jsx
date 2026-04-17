import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Auth() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      // Save token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard (adjust route as needed)
      navigate("/dashboard");

    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Allow Enter key to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2 className="auth-title">🌿 Moodlet</h2>
        <p className="auth-subtitle">Login to your calm space</p>

        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        {/* Error message */}
        {error && (
          <p style={{ color: "#e57373", fontSize: "13px", margin: "-8px 0 4px" }}>
            {error}
          </p>
        )}

        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>


        <p className="auth-switch">
            Don't have an account?
            <Link to="/signup" className="auth-link"> Sign up</Link>
        </p>


        <Link to="/">
          <button className="auth-btn" style={{ marginTop: "10px", background: "transparent", color: "#7ec9a7", border: "1.5px solid #7ec9a7" }}>
            ← Back to Home
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Auth;
