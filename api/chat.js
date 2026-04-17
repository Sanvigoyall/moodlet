import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message, mood } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "Groq API key not configured",
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const moodContext = mood
      ? `The user's current mood is ${mood}. `
      : "";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Moody 🌿, a calm emotional support chatbot. ${moodContext}Reply in a warm, friendly tone. Keep responses concise and supportive.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ||
      "I'm here for you. Could you tell me more? 🌿";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat error:", error);

    if (error?.status === 429) {
      return res.status(429).json({
        message:
          "I'm getting too many requests right now. Please wait a moment 🌿",
      });
    }

    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
}