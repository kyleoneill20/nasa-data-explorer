const API_BASE_URL = 'http://localhost:5001/api';

export const nasaAPI = {
  // Fetch Astronomy Picture of the Day
  getAPOD: async (date) => {
    try {
      const url = date 
        ? `${API_BASE_URL}/apod?date=${date}`
        : `${API_BASE_URL}/apod`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch APOD');
      return await response.json();
    } catch (error) {
      console.error('Error fetching APOD:', error);
      throw error;
    }
  },

  // Fetch Mars Rover Photos
  getMarsPhotos: async (rover, sol = 1000, camera = null) => {
    try {
      let url = `${API_BASE_URL}/mars-photos/${rover}/photos?sol=${sol}`;
      if (camera) url += `&camera=${camera}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch Mars photos');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Mars photos:', error);
      throw error;
    }
  },

  // Fetch Near Earth Asteroids
  getAsteroids: async (startDate, endDate) => {
    try {
      const url = `${API_BASE_URL}/asteroids/feed?start_date=${startDate}&end_date=${endDate}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch asteroids');
      return await response.json();
    } catch (error) {
      console.error('Error fetching asteroids:', error);
      throw error;
    }
  }
};