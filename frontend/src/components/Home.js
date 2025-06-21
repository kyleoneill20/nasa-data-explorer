import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedStats from './AnimatedStats';
import DataDashboard from './DataDashboard';
import nasaService from '../services/nasaService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faRocket, 
  faMeteor,
  faGlobe,
  faSatelliteDish,
  faMagnifyingGlass, // Instead of faTelescope
  faChartLine,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';

const Home = () => {
  const [asteroidData, setAsteroidData] = useState([]);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const asteroidsResponse = await nasaService.getAsteroids();
      const allAsteroids = Object.values(asteroidsResponse.near_earth_objects).flat();
      setAsteroidData(allAsteroids);

      const marsResponse = await nasaService.getMarsPhotos('curiosity', 1000);
      setMarsPhotos(marsResponse.photos.slice(0, 50));

      const apodResponse = await nasaService.getAPOD();
      setApodData(apodResponse);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: 'Astronomy Picture of the Day',
      description: 'Discover stunning images of our universe with detailed explanations from astronomers.',
      link: '/apod',
      icon: faImage,
      color: '#3182ce',
      stats: apodData ? '1 new image today' : 'Loading...'
    },
    {
      title: 'Mars Rover Photos',
      description: 'Explore the Martian surface through the eyes of NASA\'s rovers.',
      link: '/mars-photos',
      icon: faRocket,
      color: '#e53e3e',
      stats: `${marsPhotos.length} photos loaded`
    },
    {
      title: 'Asteroid Tracker',
      description: 'Track near-Earth asteroids and potentially hazardous objects.',
      link: '/asteroids',
      icon: faMeteor,
      color: '#667eea',
      stats: `${asteroidData.length} objects tracked`
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="stars"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-word">NASA</span>
            <span className="title-word">Data</span>
            <span className="title-word">Explorer</span>
          </h1>
          <p className="hero-subtitle">Explore the wonders of space through NASA's public APIs</p>
          
          <div className="hero-stats">
            <div className="quick-stat">
              <FontAwesomeIcon icon={faGlobe} className="stat-icon" />
              <span className="stat-text">Real-time space data</span>
            </div>
            <div className="quick-stat">
              <FontAwesomeIcon icon={faSatelliteDish} className="stat-icon" />
              <span className="stat-text">Direct from NASA</span>
            </div>
            <div className="quick-stat">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="stat-icon" />
              <span className="stat-text">Updated daily</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="features-section">
        <h2 className="section-title">Explore Space Data</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              to={feature.link} 
              key={index} 
              className="feature-card"
              style={{ '--card-color': feature.color }}
            >
              <div className="feature-header">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <div className="feature-stats">{feature.stats}</div>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="explore-link">
                Explore 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mission Statistics */}
      {!loading && (
        <div className="stats-section">
          <AnimatedStats 
            asteroidData={asteroidData}
            marsPhotos={marsPhotos}
            currentAPOD={apodData}
          />
        </div>
      )}

      {/* Toggle Dashboard Button */}
      <div className="dashboard-toggle">
        <button 
          className="toggle-button"
          onClick={() => setShowDashboard(!showDashboard)}
        >
          {showDashboard ? 'Hide' : 'Show'} Data Analytics Dashboard
          <FontAwesomeIcon 
            icon={showDashboard ? faChartLine : faChartBar} 
            className="toggle-icon" 
          />
        </button>
      </div>

      {/* Data Dashboard */}
      {!loading && showDashboard && (
        <div className="dashboard-section">
          <DataDashboard
            asteroidData={asteroidData}
            marsPhotos={marsPhotos}
            apodHistory={[apodData]}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading space data...</p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4><FontAwesomeIcon icon={faRocket} /> About This Project</h4>
            <p>NASA Data Explorer provides real-time access to space data including asteroids, Mars rover photos, and daily astronomy pictures.</p>
          </div>
          <div className="footer-section">
            <h4><FontAwesomeIcon icon={faSatelliteDish} /> Data Sources</h4>
            <p>All data is fetched directly from NASA's public APIs, ensuring accurate and up-to-date information about our solar system.</p>
          </div>
          <div className="footer-section">
            <h4><FontAwesomeIcon icon={faMagnifyingGlass} /> Updates</h4>
            <p>Data refreshes automatically. Asteroid data updates weekly, Mars photos daily, and APOD updates every 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;