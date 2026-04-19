const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');

const app = express();

app.use(cors({
    origin: [
      'https://sparkly-donut-bf04ab.netlify.app',
      'http://localhost:3000'
    ],
    credentials: true
  }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auth server is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ✅ Connect to MongoDB (without blocking export)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ✅ Local dev server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Required for Vercel
module.exports = app;