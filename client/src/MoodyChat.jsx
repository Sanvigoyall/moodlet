import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mic, MicOff, Send, User, Bot, Leaf, Volume2, VolumeX } from 'lucide-react';
import './MoodyChat.css';

const MoodyChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hi, I'm Moody 🌿 — I'm here for you. How are you feeling today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(() => {
    const stored = localStorage.getItem('moody_speech_enabled');
    return stored === null ? true : stored === 'true';
  });
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Toggle speech on/off
  const toggleSpeech = useCallback(() => {
    setIsSpeechEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('moody_speech_enabled', String(next));
      if (!next) {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  // Speak a text response aloud using browser TTS
  const speakText = useCallback((text) => {
    if (!window.speechSynthesis || !isSpeechEnabled) return;
    window.speechSynthesis.cancel();

    const doSpeak = (voices) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Calm & soothing voice settings
      utterance.rate   = 0.78;   // slow, unhurried
      utterance.pitch  = 0.88;   // soft, slightly lower
      utterance.volume = 0.95;

      // Lock to one specific calm female voice.
      // We look for 'Samantha' (macOS) or 'Google UK English Female' (Chrome)
      const targetVoice =
        voices.find((v) => v.name === 'Samantha') ||
        voices.find((v) => v.name === 'Google UK English Female') ||
        voices.find((v) => v.name.toLowerCase().includes('female')) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (targetVoice) utterance.voice = targetVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend   = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        doSpeak(window.speechSynthesis.getVoices());
      };
    }
  }, [isSpeechEnabled]);

  // Send a message to Groq backend and get a reply
  const sendToGroq = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mood: selectedMood })
      });
      const data = await response.json();
      setIsTyping(false);

      const replyText = response.ok
        ? data.reply
        : (data.message || 'Sorry, something went wrong. Please try again. 🌿');

      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Speak the reply aloud
      speakText(replyText);

    } catch (error) {
      console.error('Error fetching from /api/chat:', error);
      setIsTyping(false);
      const errText = "Couldn't reach the server. Please check your connection and try again. 🌿";
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: errText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speakText(errText);
    }
  }, [selectedMood, speakText]);

  // Handle text input send
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    await sendToGroq(msg);
  };

  // Toggle voice input using Web Speech API
  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support voice input. Please use Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Stop any ongoing speech before listening
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      sendToGroq(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        setMessages((prev) => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: `Voice error: ${event.error}. Please try again. 🌿`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="moody-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <nav className="moody-navbar">
        <Link to="/" className="moody-navbar-logo">
          <Leaf size={24} color="#5c4d7d" /> Moodlet
        </Link>
        <div className="moody-nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Mood Tracker</Link>
          <Link to="/chat" className="active">Chat</Link>
          <Link to="/auth">Profile</Link>
        </div>
      </nav>

      <main className="moody-main">
        <div className="moody-header">
          <div className="moody-header-top">
            <h1>Moody Assistant</h1>
            <button
              className={`speech-toggle-btn ${isSpeechEnabled ? 'enabled' : 'disabled'}`}
              onClick={toggleSpeech}
              title={isSpeechEnabled ? 'Mute Moody voice' : 'Unmute Moody voice'}
              aria-label={isSpeechEnabled ? 'Mute voice' : 'Unmute voice'}
            >
              {isSpeechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>{isSpeechEnabled ? 'Voice ON' : 'Voice OFF'}</span>
            </button>
          </div>
          <p>
            {isListening
              ? '🎙️ Listening...'
              : isSpeaking
              ? '🔊 Speaking...'
              : 'A safe, non-judgmental space.'}
          </p>
        </div>

        <div className="mood-selector">
          {['😊', '😔', '😡', '😴', '😰'].map((emoji, idx) => (
            <button
              key={idx}
              className={`mood-btn ${selectedMood === emoji ? 'selected' : ''}`}
              onClick={() => setSelectedMood(emoji)}
              aria-label="Select mood"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
                <div className="message-time">
                  {msg.sender === 'bot' ? <Bot size={12} /> : <User size={12} />} {msg.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-wrapper bot">
                <div className="message-bubble typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <div className="vapi-placeholder" title="Talk to Moody">
              <button
                className={`mic-btn ${isListening ? 'active' : ''}`}
                onClick={handleVoiceToggle}
                type="button"
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', flex: 1, gap: '0.75rem' }}>
              <input
                type="text"
                className="chat-input"
                placeholder={isListening ? 'Listening...' : 'Type your message here...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isListening}
              />
              <button type="submit" className="send-btn" disabled={!input.trim() || isListening}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoodyChat;