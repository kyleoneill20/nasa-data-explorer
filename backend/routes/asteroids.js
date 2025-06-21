const router = require('express').Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const today = new Date().toISOString().split('T')[0];
    
    const params = {
      api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
      start_date: start_date || today,
      end_date: end_date || today
    };
    
    const response = await axios.get(
      'https://api.nasa.gov/neo/rest/v1/feed',
      { params }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Asteroids Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch asteroid data' });
  }
});

module.exports = router;