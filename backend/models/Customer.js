const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  businessName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  area: { type: String },
  currentBalance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);