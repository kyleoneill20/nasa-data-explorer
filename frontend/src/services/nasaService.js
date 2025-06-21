import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Export individual functions that components are importing
export const getAPOD = async (date) => {
  try {
    const params = date ? { date } : {};
    const response = await api.get('/apod', { params });
    return response.data; // Return just the data, not the full response
  } catch (error) {
    console.error('APOD API Error:', error);
    throw error;
  }
};

// Updated to match the original Mars Photos component
export const getMarsPhotos = async (rover, sol, camera) => {
  try {
    const params = { sol };
    if (camera) params.camera = camera;
    
    const response = await api.get(`/mars-photos/${rover}/photos`, { params });
    return response.data; // Return just the data
  } catch (error) {
    console.error('Mars Photos API Error:', error);
    throw error;
  }
};

export const getMarsManifest = async (rover) => {
  try {
    const response = await api.get(`/mars-photos/${rover}/manifest`);
    return response.data; // Return just the data
  } catch (error) {
    console.error('Mars Manifest API Error:', error);
    throw error;
  }
};

export const getAsteroids = async (startDate, endDate) => {
  try {
    const response = await api.get('/asteroids/feed', {
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
    const response = await api.get('/asteroids/today');
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