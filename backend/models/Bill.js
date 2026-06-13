const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: false });

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  billNumber: { type: Number, required: true },
  billDate: { type: Date, required: true },
  party: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    companyName: String,
    gstNumber: String,
    address: String,
    phone: String,
  },
  items: [billItemSchema],
  subtotal: { type: Number, required: true },
  gstPercent: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  notes: { type: String, default: '' },
  deletedAt: { type: Date, default: null, index: { expireAfterSeconds: 2592000 } }
}, { timestamps: true });

billSchema.index({ userId: 1, billNumber: 1 }, { unique: true });

module.exports = mongoose.model('Bill', billSchema);
