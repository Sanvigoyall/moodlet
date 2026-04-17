const express = require('express');
const Groq = require('groq-sdk');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, mood } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: 'Groq API key is not configured. Please set GROQ_API_KEY in your .env file.'
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const moodContext = mood ? `The user's current mood is ${mood}. ` : '';

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Moody 🌿, a calm emotional support chatbot. ${moodContext}Reply in a warm, friendly tone. Keep responses concise and supportive.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm here for you. Could you tell me more? 🌿";
    res.json({ reply });

  } catch (error) {
    console.error('Chat route error:', error?.message || error);

    if (error?.status === 429) {
      return res.status(429).json({
        message: "I'm getting too many requests right now. Please wait a moment and try again. 🌿"
      });
    }

    res.status(500).json({ message: 'Something went wrong while talking to Moody. Please try again later.' });
  }
});

module.exports = router;