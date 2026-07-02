const express = require('express');
const ProductionBatch = require('../models/ProductionBatch');
const Product = require('../models/Product');
const RawMaterial = require('../models/RawMaterial');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { batchNumber, productId, outputBottles, rawMaterialsConsumed, notes } = req.body;

    // 1. Create the batch record
    const batch = await ProductionBatch.create({
      batchNumber, productId, outputBottles, rawMaterialsConsumed, notes
    });

    // 2. Increase product stock
    await Product.findByIdAndUpdate(productId, {
      $inc: { stockBottles: outputBottles }
    });

    // 3. Decrease each raw material's stock
    for (const item of rawMaterialsConsumed) {
      await RawMaterial.findByIdAndUpdate(item.materialId, {
        $inc: { currentQuantity: -item.quantityUsed }
      });
    }

    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const batches = await ProductionBatch.find()
      .populate('productId')
      .populate('rawMaterialsConsumed.materialId');
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;