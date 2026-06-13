const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, default: 'Company Name' },
  gstNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
});

module.exports = mongoose.model('Profile', profileSchema);
