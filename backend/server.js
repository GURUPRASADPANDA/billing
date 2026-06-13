require('dotenv').config();

const express = require('express');
const cors = require('cors');
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});