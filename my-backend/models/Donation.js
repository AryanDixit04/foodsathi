const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  place: String,
  purpose: String,
  phone: String,
  email: String,
  amount: String,
  location: {
    lat: Number,
    lng: Number
  },
  time: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;