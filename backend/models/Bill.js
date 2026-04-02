const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: false });

const billSchema = new mongoose.Schema({
  billNumber: { type: Number, required: true, unique: true },
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
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
