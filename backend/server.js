require('dotenv').config(); // THIS MUST BE THE VERY FIRST LINE
console.log('NASA API Key loaded:', process.env.NASA_API_KEY);

const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'NASA Data Explorer API is running' });
});

// API Routes
app.use('/api/apod', require('./routes/apod'));
app.use('/api/mars-photos', require('./routes/marsPhotos'));
app.use('/api/asteroids', require('./routes/asteroids'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`APOD endpoint: http://localhost:${PORT}/api/apod`);
});

// Keep the process running
process.stdin.resume();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});