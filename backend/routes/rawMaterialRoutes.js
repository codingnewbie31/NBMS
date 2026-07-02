const express = require('express');
const RawMaterial = require('../models/RawMaterial');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const material = await RawMaterial.create(req.body);
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const materials = await RawMaterial.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;