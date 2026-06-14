require('dotenv').config();

const express = require('express');
const cors = require('cors');
const https = require('https');
const connectDB = require('./config/db');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
connectDB();

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
const { protect } = require('./middleware/authMiddleware');

app.use('/api/parties', protect, require('./routes/parties'));
app.use('/api/items', protect, require('./routes/items'));
app.use('/api/bills', protect, require('./routes/bills'));
app.use('/api/profile', protect, require('./routes/profile'));
app.use('/api/trash', protect, require('./routes/trash'));

// ✅ Health Route (for uptime ping)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Billing API is running 🚀'
  });
});

// ✅ Root Route (optional)
app.get('/', (req, res) => {
  res.send('Backend is live 🚀');
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    error: err.message || 'Something went wrong!'
  });
});

// ✅ IMPORTANT: Render PORT
const PORT = process.env.PORT || 5000;

// ✅ Keep Server Alive on Render (Self-Ping every 10 minutes)
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
const SERVER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

if (process.env.RENDER_EXTERNAL_URL) {
  setInterval(() => {
    https.get(`${SERVER_URL}/api/health`, (res) => {
      console.log(`📡 Self-ping successful: ${res.statusCode} at ${new Date().toLocaleTimeString()}`);
    }).on('error', (err) => {
      console.error(`🔥 Self-ping failed:`, err.message);
    });
  }, PING_INTERVAL);
  console.log(`⏱️  Self-ping scheduled every 10 minutes for ${SERVER_URL}`);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});