// routes/notification.js (UPDATED)
const express = require('express');
const router = express.Router();

let mockDonations = [
  {
    _id: '1',
    name: 'Alice',
    place: 'bncet',
    purpose: 'Food Drive',
    phone: '1234567890',
    email: 'alice@example.com',
    amount: 20,
    type: 'food',
    time: new Date()
  },
  {
    _id: '2',
    name: 'Bob',
    place: 'Bkt',
    purpose: 'Temple Event',
    phone: '9876543210',
    email: 'bob@example.com',
    amount: 30,
    type: 'food',
    time: new Date()
  }
];

// GET all donations
router.get('/', (req, res) => {
  const sorted = [...mockDonations].sort((a, b) => new Date(b.time) - new Date(a.time));
  res.json(sorted);
});

// POST a new request
// POST a new request
router.post('/', (req, res) => {
  console.log('🔥 POST /api/notification hit!');
  const { name, place, purpose, phone, email, amount } = req.body;

  const newRequest = {
    _id: (mockDonations.length + 1).toString(),
    name,
    place,
    purpose,
    phone,
    email,
    amount: Number(amount),
    type: 'request',
    time: new Date()
  };

  // ✅ Match logic: match by EXACT amount and place (case-insensitive)
  const match = mockDonations.find(
    (donation) =>
      donation.place.trim().toLowerCase() === place.trim().toLowerCase() &&
      Number(donation.amount) === Number(amount)
  );

  mockDonations.push(newRequest);

  if (match) {
    res.status(200).json({ matchFound: true, matchData: match });
  } else {
    res.status(200).json({ matchFound: false });
  }
});


module.exports = router;
