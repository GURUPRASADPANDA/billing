const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://billing:billing@cluster0.oanpcii.mongodb.net/?appName=Cluster0';

// mongoose.connect(MONGO_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Replace this:
// With this:
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://billing:billing@cluster0.oanpcii.mongodb.net/?appName=Cluster0');
  isConnected = true;
}
app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch { res.status(500).json({ error: 'DB connection failed' }); }
});




app.use('/api/parties', require('./routes/parties'));
app.use('/api/items', require('./routes/items'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/profile', require('./routes/profile'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Billing API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});


// With this:
if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => console.log('🚀 Local server on port 5000'));
}
module.exports = app;