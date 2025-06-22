import axios from 'axios';

// NASA API Configuration
const NASA_API_KEY = 'mie3qopgrVZ3LwcM9LocDVdXSXeQnUnIH2W7SVS0';
const NASA_BASE_URL = 'https://api.nasa.gov';

// Create axios instance for NASA API
const nasaApi = axios.create({
  baseURL: NASA_BASE_URL,
  timeout: 30000,
  params: {
    api_key: NASA_API_KEY
  }
});

// Helper function to format dates
const formatDate = (date) => {
  return date instanceof Date ? date.toISOString().split('T')[0] : date;
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Get date 7 days ago
const getWeekAgoDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
};

export const getAPOD = async (date) => {
  try {
    const params = date ? { date: formatDate(date), api_key: NASA_API_KEY } : { api_key: NASA_API_KEY };
    const response = await axios.get(`${NASA_BASE_URL}/planetary/apod`, { params });
    return response.data;
  } catch (error) {
    console.error('APOD API Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch APOD: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const getMarsPhotos = async (rover = 'curiosity', sol = 1000, camera = null) => {
  try {
    const params = {
      sol: sol,
      api_key: NASA_API_KEY
    };
    
    if (camera) {
      params.camera = camera;
    }
    
    const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`, { params });
    return response.data;
  } catch (error) {
    console.error('Mars Photos API Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch Mars photos: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const getMarsManifest = async (rover = 'curiosity') => {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}`, {
      params: { api_key: NASA_API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error('Mars Manifest API Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch Mars manifest: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const getAsteroids = async (startDate = null, endDate = null) => {
  try {
    // If no dates provided, use last 7 days
    const start = startDate ? formatDate(startDate) : getWeekAgoDate();
    const end = endDate ? formatDate(endDate) : getTodayDate();
    
    const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, {
      params: {
        start_date: start,
        end_date: end,
        api_key: NASA_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Asteroids API Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch asteroids: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const getTodayAsteroids = async () => {
  try {
    const today = getTodayDate();
    return await getAsteroids(today, today);
  } catch (error) {
    console.error('Today Asteroids API Error:', error);
    throw error;
  }
};

// Export the nasaService object for backward compatibility
export const nasaService = {
  getAPOD,
  getMarsPhotos,
  getMarsManifest,
  getAsteroids,
  getTodayAsteroids
};

export default nasaService;