const mongoose = require('mongoose');

// Generic atomic counter, used for generating sequential numbers
// (order numbers, batch numbers, etc.) without race conditions.
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "orderNumber"
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', CounterSchema);