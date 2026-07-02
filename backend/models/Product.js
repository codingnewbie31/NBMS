const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, enum: ['Water', 'Juice', 'Soft Drinks'], required: true },
  caseCapacity: { type: Number, required: true },
  pricePerCase: { type: Number, required: true },
  pricePerBottle: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  stockBottles: { type: Number, default: 0, min: 0 },
  lowStockLimit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);