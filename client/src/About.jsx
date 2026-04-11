import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function About() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">

        
          <div className="hero-text">
            <h1 className="hero-title">🌿 About Moodlet</h1>

            <p className="hero-description">
              Moodlet is a gentle mental health companion designed to help you
              slow down, reflect, and understand your emotions better.
              In a fast-moving world, Moodlet gives you a calm digital space
              where your thoughts and feelings can exist safely.
            </p>

            <h2 className="hero-tagline">What you can do with Moodlet</h2>

            <p className="hero-description">
              💬 Talk with an AI companion when you need someone to listen.
              <br />
              📝 Write journal entries to express your thoughts privately.
              <br />
              🌤 Track and reflect on your moods over time.
              <br />
              🧠 Build emotional awareness and healthy reflection habits.
            </p>

            <h2 className="hero-tagline">How it works</h2>

            <p className="hero-description">
              Create an account, sign in to your personal dashboard,
              and start exploring Moodlet.
            </p>

            {/* BUTTONS */}
            <div className="hero-buttons">
              <Link to="/auth" className="btn-link">
                <button className="btn-large btn-primary">
                  Get Started
                </button>
              </Link>

              <Link to="/" className="btn-link">
                <button className="btn-large btn-secondary">
                  Back Home
                </button>
              </Link>
            </div>

          </div>

          {/* VISUAL SECTION */}
          <div className="hero-visual">
            <div className="mood-circles">
              <div className="mood-circle">🌱</div>
              <div className="mood-circle">💭</div>
              <div className="mood-circle">🌸</div>
              <div className="mood-circle">🧘</div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default About;