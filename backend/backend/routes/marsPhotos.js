const router = require('express').Router();
const axios = require('axios');

// The base path '/api/mars-photos' is already defined in server.js
router.get('/:rover/photos', async (req, res) => {
  try {
    const { rover } = req.params;
    const { sol, page = 1 } = req.query;
    
    const params = {
      api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
      sol: sol || 1000,
      page: page
    };
    
    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      { params }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Mars Photos Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Mars photos' });
  }
});

module.exports = router;