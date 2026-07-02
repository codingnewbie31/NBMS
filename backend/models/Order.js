const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qtyBottles: { type: Number, required: true },
    caseCapacityAtSale: { type: Number, required: true },
    pricePerCaseAtSale: { type: Number, required: true },
    costPerCaseAtSale: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  grandTotal: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  outstandingBalance: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);