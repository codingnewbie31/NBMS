const mongoose = require('mongoose');

const RawMaterialSchema = new mongoose.Schema({
  materialName: { type: String, required: true, unique: true, trim: true },
  unitType: { type: String, enum: ['Pcs', 'Kg', 'Liters'], required: true },
  currentQuantity: { type: Number, default: 0 },
  lowStockLimit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('RawMaterial', RawMaterialSchema);