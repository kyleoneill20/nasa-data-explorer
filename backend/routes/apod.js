const router = require('express').Router();
const axios = require('axios');


router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const params = {
      api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
      date: date
    };
    
    const response = await axios.get('https://api.nasa.gov/planetary/apod', { params });
    res.json(response.data);
  } catch (error) {
    console.error('APOD Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch APOD data' });
  }
});

module.exports = router;