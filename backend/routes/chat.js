const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // Initialize inside the handler so it reads the key at request time
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(`
You are Moody 🌿, a calm emotional support chatbot.
User: ${message}
Reply in a warm, friendly tone.
`);

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Chat error' });
  }
});

module.exports = router;