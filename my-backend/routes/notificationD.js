const express = require('express');
const router = express.Router();

let mockDonations = [
  {
    _id: '1',
    name: 'Alice',
    location: { lat: 26.8467, lng: 80.9462 },
    number: '1234567890',
    email: 'alice@example.com',
    quantity: 20,
    description: 'Cooked food. Expiry in 4 hours.',
    time: new Date()
  },
  {
    _id: '2',
    name: 'Bob',
    location: { lat: 26.8469, lng: 80.9475 },
    number: '9876543210',
    email: 'bob@example.com',
    quantity: 15,
    description: 'Snacks. Expiry in 6 hours.',
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

  const { name, location, number, email, quantity, description } = req.body;

  const newDonation = {
    _id: (mockDonations.length + 1).toString(),
    name,
    location,
    number,
    email,
    quantity,
    description,
    time: new Date()
  };

  // Simulate basic location match (within ~1km lat/lng difference and same quantity)
  const matched = mockDonations.find(donation => {
    const latDiff = Math.abs(donation.location.lat - location.lat);
    const lngDiff = Math.abs(donation.location.lng - location.lng);
    return latDiff < 0.01 && lngDiff < 0.01 && donation.quantity === quantity;
  });

  mockDonations.push(newDonation);

  res.status(201).json({
    message: 'Mock donation saved',
    data: newDonation,
    matchFound: !!matched,
    matchedWith: matched || null
  });
});

module.exports = router;
