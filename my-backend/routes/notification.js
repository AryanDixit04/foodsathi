// routes/notification.js (MOCKED VERSION)
const express = require('express');
const router = express.Router();

let mockDonations = [
  {
    _id: '1',
    name: 'Alice',
    type: 'food',
    time: new Date()
  },
  {
    _id: '2',
    name: 'Bob',
    type: 'food',
    time: new Date()
  }
];

// GET /api/notification
router.get('/', (req, res) => {
  const sorted = [...mockDonations].sort((a, b) => new Date(b.time) - new Date(a.time));
  res.json(sorted);
});

// POST /api/notification
router.post('/', (req, res) => {
  console.log('🔥 POST /api/notification hit!');
  console.log('Mock POST body:', req.body);

  const newDonation = {
    _id: (mockDonations.length + 1).toString(),
    ...req.body,
    type: 'food',      // <-- force type to 'food' regardless of client data
    time: new Date()
  };

  mockDonations.push(newDonation);
  res.status(201).json({ message: 'Mock donation saved', data: newDonation });
});

module.exports = router;
