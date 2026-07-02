const mongoose = require('mongoose');

const ProductionBatchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true, unique: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  outputBottles: { type: Number, required: true },
  manufacturingDate: { type: Date, default: Date.now },
  rawMaterialsConsumed: [{
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
    quantityUsed: { type: Number, required: true }
  }],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('ProductionBatch', ProductionBatchSchema);