import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Export individual functions that components are importing
export const getAPOD = async (date) => {
  try {
    const params = date ? { date } : {};
    const response = await api.get('/api/apod', { params });
    return response.data; // Return just the data, not the full response
  } catch (error) {
    console.error('APOD API Error:', error);
    throw error;
  }
};

// Updated to match backend route structure
export const getMarsPhotos = async (rover = 'curiosity', sol, camera) => {
  try {
    const params = { rover, sol };
    if (camera) params.camera = camera;
    
    const response = await api.get('/api/mars-photos', { params });
    return response.data; // Return just the data
  } catch (error) {
    console.error('Mars Photos API Error:', error);
    throw error;
  }
};

export const getMarsManifest = async (rover) => {
  try {
    const response = await api.get('/api/mars-photos', { params: { rover } });
    return response.data; // Return just the data
  } catch (error) {
    console.error('Mars Manifest API Error:', error);
    throw error;
  }
};

export const getAsteroids = async (startDate, endDate) => {
  try {
    const response = await api.get('/api/asteroids', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data; // Return just the data
  } catch (error) {
    console.error('Asteroids API Error:', error);
    throw error;
  }
};

export const getTodayAsteroids = async () => {
  try {
    const response = await api.get('/api/asteroids');
    return response.data; // Return just the data
  } catch (error) {
    console.error('Today Asteroids API Error:', error);
    throw error;
  }
};

// Also export the nasaService object for backward compatibility
export const nasaService = {
  getAPOD,
  getMarsPhotos,
  getMarsManifest,
  getAsteroids,
  getTodayAsteroids
};

export default nasaService;