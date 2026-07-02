const express = require("express");
const Order = require("../models/Order");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Fetch orders in range
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
    });

    let grossRevenue = 0;
    let totalCostOfGoods = 0;

    for (const order of orders) {
      grossRevenue += order.grandTotal;

      for (const item of order.items) {
        if (!item.caseCapacityAtSale) continue; // skip incomplete legacy data
        const costPerBottle = item.costPerCaseAtSale / item.caseCapacityAtSale;
        totalCostOfGoods += costPerBottle * item.qtyBottles;
      }
    }

    // Fetch expenses in range
    const expenses = await Expense.find({
      date: { $gte: start, $lte: end },
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const grossMargin = grossRevenue - totalCostOfGoods;
    const netProfit = grossMargin - totalExpenses;

    res.json({
      dateRange: { startDate, endDate },
      grossRevenue,
      totalCostOfGoods,
      grossMargin,
      totalExpenses,
      netProfit,
      orderCount: orders.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Today's revenue
    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lte: todayEnd }
    });
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    // Total receivables (all customers with outstanding balance)
    const Customer = require('../models/Customer');
    const customers = await Customer.find({ currentBalance: { $gt: 0 } });
    const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);

    // Low stock products
    const Product = require('../models/Product');
    const products = await Product.find();
    const lowStockProducts = products.filter(p => p.stockBottles <= p.lowStockLimit);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'businessName');

    res.json({
      todayRevenue,
      totalReceivables,
      lowStockProducts,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
