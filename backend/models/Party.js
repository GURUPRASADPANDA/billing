const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  gstNumber: { type: String, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  deletedAt: { type: Date, default: null, index: { expireAfterSeconds: 2592000 } }
}, { timestamps: true });

module.exports = mongoose.model('Party', partySchema);
