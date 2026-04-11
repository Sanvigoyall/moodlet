import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Send, User, Bot, Leaf } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import './MoodyChat.css';

const vapi = new Vapi('90705508-96a6-4094-8273-6cca2376cb55');

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
  const [isVapiActive, setIsVapiActive] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    vapi.on('message', (msg) => {
      if (msg.type !== 'transcript' || msg.transcriptType !== 'final') return;

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.text === msg.transcript) return prev;
        return [...prev, {
          id: Date.now(),
          sender: msg.role === 'user' ? 'user' : 'bot',
          text: msg.transcript,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      });
    });

    vapi.on('call-end', () => {
      setIsVapiActive(false);
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, mood: selectedMood })
      });
      const data = await response.json();
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('Error fetching from /api/chat:', error);
      setIsTyping(false);
    }
  };

  const handleVapiToggle = async () => {
    if (isVapiActive) {
      vapi.stop();
      setIsVapiActive(false);
    } else {
      setIsVapiActive(true);
      await vapi.start({
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
        },
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          systemPrompt: `You are Moody 🌿, a calm emotional support chatbot. Reply in a warm, friendly tone. Keep responses concise.`,
        },
        voice: {
          provider: 'playht',
          voiceId: 'jennifer',
        },
      });
    }
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
          <h1>Moody Assistant</h1>
          <p>{isVapiActive ? '🎙️ Listening...' : 'A safe, non-judgmental space.'}</p>
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
                className={`mic-btn ${isVapiActive ? 'active' : ''}`}
                onClick={handleVapiToggle}
                type="button"
              >
                <Mic size={20} />
              </button>
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', flex: 1, gap: '0.75rem' }}>
              <input
                type="text"
                className="chat-input"
                placeholder={isVapiActive ? 'Voice mode active...' : 'Type your message here...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isVapiActive}
              />
              <button type="submit" className="send-btn" disabled={!input.trim() || isVapiActive}>
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