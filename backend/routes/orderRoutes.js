const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { orderNumber, customerId, items, amountPaid } = req.body;

    let grandTotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      if (product.stockBottles < item.qtyBottles) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

      const pricePerBottle = product.pricePerCase / product.caseCapacity;
      const subtotal = pricePerBottle * item.qtyBottles;
      grandTotal += subtotal;

      processedItems.push({
        productId: product._id,
        qtyBottles: item.qtyBottles,
        caseCapacityAtSale: product.caseCapacity,
        pricePerCaseAtSale: product.pricePerCase,
        costPerCaseAtSale: product.costPrice,
        subtotal
      });

      // Reduce stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stockBottles: -item.qtyBottles }
      });
    }

    const outstandingBalance = grandTotal - (amountPaid || 0);

    const order = await Order.create({
      orderNumber,
      customerId,
      items: processedItems,
      grandTotal,
      amountPaid: amountPaid || 0,
      outstandingBalance,
      createdBy: req.user.userId
    });

    // Update customer balance
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { currentBalance: outstandingBalance }
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId')
      .populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete orders 
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;