import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleSignup = async () => {
    const { name, email, password, confirmPassword } = formData;

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed. Please try again.");
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <h2 className="signup-title">🌿 Moodlet</h2>
        <p className="signup-subtitle">Create your calm space</p>

        <input
          className="signup-input"
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <input
          className="signup-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <input
          className="signup-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <input
          className="signup-input"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        {/* Error message */}
        {error && (
          <p style={{ color: "#e57373", fontSize: "13px", margin: "-6px 0 2px" }}>
            {error}
          </p>
        )}

        <button
          className="signup-btn"
          onClick={handleSignup}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="signup-switch">
          Already have an account?
          <Link to="/auth" className="signup-link"> Login</Link>
        </p>

        <Link to="/">
          <button className="signup-btn" style={{ marginTop: "10px", background: "transparent", color: "#7bbfa2", border: "1.5px solid #7bbfa2" }}>
             ← Back to Home
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Signup;
