const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  defaultPrice: { type: Number, default: 0 },
  unit: { type: String, default: 'pcs', trim: true },
  deletedAt: { type: Date, default: null, index: { expireAfterSeconds: 2592000 } }
}, { timestamps: true });

itemSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Item', itemSchema);
