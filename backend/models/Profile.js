const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  companyName: { type: String, default: 'Mohavhir Enterprises' },
  gstNumber: { type: String, default: '27AAGFM1234C1Z5' },
  address: { type: String, default: '123, Industrial Area, Phase 2, Mumbai - 400001, Maharashtra' },
  phone: { type: String, default: '+91 98765 43210' },
});

module.exports = mongoose.model('Profile', profileSchema);
