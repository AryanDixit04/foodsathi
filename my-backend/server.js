const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || /^http:\/\/localhost:30\d{2}$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

// Connect to DB for all routes except /api/notification mock
connectDB(); // always connect DB for all except mock notifications

// Serve static frontend (React build)
app.use(express.static(path.join(__dirname, 'build')));

// Basic welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the FoodSathi API!');
});

// API routes that use real DB
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ngo', require('./routes/ngo'));
app.use('/api/restaurant', require('./routes/restaurant'));
app.use('/api/chatbot', require('./routes/chatbot/chatBot'));

// Use MOCK API ONLY for /api/notification
console.log('🧪 Using MOCK Notification API for /api/notification');
app.use('/api/notification', require('./routes/notification')); // mock version

// React fallback - serve index.html for any other frontend route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
