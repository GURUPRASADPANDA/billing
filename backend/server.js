require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1); // stop app if DB fails
  }
};

// Call DB connection once
connectDB();

// ✅ Routes
app.use('/api/parties', require('./routes/parties'));
app.use('/api/items', require('./routes/items'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/profile', require('./routes/profile'));

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});