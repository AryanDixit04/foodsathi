const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation'); // 🔸 Use the model

// POST /api/notification
router.post('/', async (req, res) => {
  try {
    const { name, type } = req.body;
    const donation = new Donation({ name, type });
    await donation.save();

    res.status(201).json({ message: 'Donation saved', data: donation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save donation' });
  }
});

// GET /api/notification
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ time: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});
module.exports = router;
