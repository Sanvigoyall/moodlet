import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">

          
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="moodlet-logo">🌿</span> Moodlet
            </h1>

            <p className="hero-tagline">
              Your calm mental health companion
            </p>

            <p className="hero-description">
              A warm, welcoming space to reflect, journal, and reconnect
              with your mind. Talk with an AI companion, track your moods,
              and build healthier mental habits.
            </p>

            <div className="hero-buttons">

              
              <Link to="/auth" className="btn-link">
                <button className="btn-large btn-primary">
                  Get Started
                </button>
              </Link>

              <Link to="/about" className="btn-link">
                <button className="btn-large btn-secondary">
                  Learn More
                </button>
              </Link>

            </div>
          </div>

          
          <div className="hero-visual">
            <div className="mood-circles">
              <div className="mood-circle">😊</div>
              <div className="mood-circle">🌞</div>
              <div className="mood-circle">🌸</div>
              <div className="mood-circle">💬</div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;