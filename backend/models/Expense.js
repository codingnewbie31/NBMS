const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  expenseName: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Raw Materials', 'Transport & Fuel', 'Factory Maintenance', 'Utilities', 'Staff Food/Allowances', 'Miscellaneous'] 
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: String,
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);