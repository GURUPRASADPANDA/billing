const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  defaultPrice: { type: Number, default: 0 },
  unit: { type: String, default: 'pcs', trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
