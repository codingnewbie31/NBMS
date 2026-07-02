const express = require('express');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { customerId, orderId, amount } = req.body;

    const payment = await Payment.create({
      customerId,
      orderId,
      amount,
      recordedBy: req.user.userId
    });

    // Reduce customer's outstanding balance
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { currentBalance: -amount }
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customerId')
      .populate('orderId')
      .populate('recordedBy', 'name');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;