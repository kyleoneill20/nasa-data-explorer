import React, { useState, useEffect } from 'react';
import { getMarsPhotos } from '../services/nasaService';
import '../styles/MarsPhotos.css';

const MarsPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedCamera, setSelectedCamera] = useState('FHAZ');
  const [sol, setSol] = useState(1000);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const cameras = {
    curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
    opportunity: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
    spirit: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES']
  };

  const maxSols = {
    curiosity: 4000,
    opportunity: 5111,
    spirit: 2208
  };

  useEffect(() => {
    fetchPhotos();
  }, [selectedRover, sol, selectedCamera]);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarsPhotos(selectedRover, sol, selectedCamera);
      setPhotos(data.photos || []);
    } catch (err) {
      setError('Failed to fetch Mars photos. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoverChange = (e) => {
    setSelectedRover(e.target.value);
    setSelectedCamera(cameras[e.target.value][0]);
    setSol(Math.min(sol, maxSols[e.target.value]));
  };

  const handleCameraChange = (e) => {
    setSelectedCamera(e.target.value);
  };

  const handleSolSlide = (e) => {
    setSol(parseInt(e.target.value));
  };

  const openFullscreen = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeFullscreen = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="mars-photos">
      <div className="mars-header">
        <h2>Mars Rover Photos</h2>
        <p className="mars-subtitle">Explore the Red Planet through the eyes of NASA's rovers</p>
      </div>
      
      <div className="controls-container">
        <div className="rover-camera-controls">
          <div className="control-group">
            <label htmlFor="rover">Rover</label>
            <select id="rover" value={selectedRover} onChange={handleRoverChange}>
              <option value="curiosity">Curiosity</option>
              <option value="opportunity">Opportunity</option>
              <option value="spirit">Spirit</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="camera">Camera</label>
            <select id="camera" value={selectedCamera} onChange={handleCameraChange}>
              {cameras[selectedRover].map(cam => (
                <option key={cam} value={cam}>{cam}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="sol-slider-section">
          <div className="sol-info">
            <span className="sol-label">Mission Sol</span>
            <span className="sol-number">{sol}</span>
          </div>
          
          <div className="slider-container">
            <span className="slider-label-start">0</span>
            <input
              type="range"
              min="0"
              max={maxSols[selectedRover]}
              value={sol}
              onChange={handleSolSlide}
              className="sol-slider"
              style={{
                background: `linear-gradient(to right, #ff6b6b 0%, #ff6b6b ${(sol / maxSols[selectedRover]) * 100}%, rgba(255,255,255,0.1) ${(sol / maxSols[selectedRover]) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <span className="slider-label-end">{maxSols[selectedRover]}</span>
          </div>
          
          <div className="sol-milestones">
            <button onClick={() => setSol(1)} className="milestone-btn">First Sol</button>
            <button onClick={() => setSol(Math.floor(maxSols[selectedRover] / 4))} className="milestone-btn">25%</button>
            <button onClick={() => setSol(Math.floor(maxSols[selectedRover] / 2))} className="milestone-btn">Midpoint</button>
            <button onClick={() => setSol(Math.floor(maxSols[selectedRover] * 0.75))} className="milestone-btn">75%</button>
            <button onClick={() => setSol(maxSols[selectedRover])} className="milestone-btn">Latest</button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Mars photos...</p>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && photos.length === 0 && (
        <div className="no-photos">No photos found for Sol {sol}</div>
      )}

      {!loading && !error && photos.length > 0 && (
        <>
          <div className="photos-count">
            Showing {photos.length} photos from Sol {sol}
          </div>
          <div className="photos-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-card" onClick={() => openFullscreen(photo)}>
                <img src={photo.img_src} alt={`Mars ${photo.camera.full_name}`} />
                <div className="photo-info">
                  <p className="camera-name">{photo.camera.full_name}</p>
                  <p className="earth-date">{new Date(photo.earth_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedPhoto && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div className="fullscreen-content">
            <img src={selectedPhoto.img_src} alt="Mars surface" />
            <div className="fullscreen-info">
              <h3>{selectedPhoto.camera.full_name}</h3>
              <p>Rover: {selectedPhoto.rover.name}</p>
              <p>Earth Date: {new Date(selectedPhoto.earth_date).toLocaleDateString()}</p>
              <p>Sol: {selectedPhoto.sol}</p>
            </div>
            <button className="close-button" onClick={closeFullscreen}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarsPhotos;