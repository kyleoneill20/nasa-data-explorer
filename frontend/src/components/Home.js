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
  faMagnifyingGlass,
  faChartLine,
  faChartBar,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';

const Home = () => {
  const [asteroidData, setAsteroidData] = useState([]);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      // Fetch all data with individual error handling
      const fetchPromises = [
        fetchAsteroids(),
        fetchMarsPhotos(),
        fetchAPOD()
      ];

      await Promise.allSettled(fetchPromises);
      
    } catch (error) {
      console.error('Error in fetchAllData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAsteroids = async () => {
    try {
      console.log('Fetching asteroids...');
      const asteroidsResponse = await nasaService.getAsteroids();
      console.log('Asteroids response:', asteroidsResponse);
      
      if (asteroidsResponse && asteroidsResponse.near_earth_objects) {
        const allAsteroids = Object.values(asteroidsResponse.near_earth_objects).flat();
        setAsteroidData(allAsteroids);
        console.log(`Loaded ${allAsteroids.length} asteroids`);
      } else {
        console.warn('No asteroid data in response');
        setAsteroidData([]);
      }
    } catch (error) {
      console.error('Error fetching asteroids:', error);
      setErrors(prev => ({ ...prev, asteroids: error.message }));
      setAsteroidData([]);
    }
  };

  const fetchMarsPhotos = async () => {
    try {
      console.log('Fetching Mars photos...');
      const marsResponse = await nasaService.getMarsPhotos('curiosity', 1000);
      console.log('Mars response:', marsResponse);
      
      if (marsResponse && marsResponse.photos) {
        const photos = marsResponse.photos.slice(0, 50);
        setMarsPhotos(photos);
        console.log(`Loaded ${photos.length} Mars photos`);
      } else {
        console.warn('No Mars photos in response');
        setMarsPhotos([]);
      }
    } catch (error) {
      console.error('Error fetching Mars photos:', error);
      setErrors(prev => ({ ...prev, mars: error.message }));
      setMarsPhotos([]);
    }
  };

  const fetchAPOD = async () => {
    try {
      console.log('Fetching APOD...');
      const apodResponse = await nasaService.getAPOD();
      console.log('APOD response:', apodResponse);
      
      setApodData(apodResponse);
    } catch (error) {
      console.error('Error fetching APOD:', error);
      setErrors(prev => ({ ...prev, apod: error.message }));
      setApodData(null);
    }
  };

  const retryFetch = () => {
    fetchAllData();
  };

  const features = [
    {
      title: 'Astronomy Picture of the Day',
      description: 'Discover stunning images of our universe with detailed explanations from astronomers.',
      link: '/apod',
      icon: faImage,
      color: '#3182ce',
      stats: apodData ? '1 new image today' : errors.apod ? 'Error loading' : 'Loading...',
      hasError: !!errors.apod
    },
    {
      title: 'Mars Rover Photos',
      description: 'Explore the Martian surface through the eyes of NASA\'s rovers.',
      link: '/mars-photos',
      icon: faRocket,
      color: '#e53e3e',
      stats: errors.mars ? 'Error loading' : `${marsPhotos.length} photos loaded`,
      hasError: !!errors.mars
    },
    {
      title: 'Asteroid Tracker',
      description: 'Track near-Earth asteroids and potentially hazardous objects.',
      link: '/asteroids',
      icon: faMeteor,
      color: '#667eea',
      stats: errors.asteroids ? 'Error loading' : `${asteroidData.length} objects tracked`,
      hasError: !!errors.asteroids
    }
  ];

  const hasAnyErrors = Object.keys(errors).length > 0;

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

      {/* Error Alert */}
      {hasAnyErrors && (
        <div className="error-alert">
          <div className="error-content">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <div className="error-text">
              <h4>Some data couldn't be loaded</h4>
              <p>There were issues loading some NASA data. You can still explore available content.</p>
              <button onClick={retryFetch} className="retry-button">
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Features Grid */}
      <div className="features-section">
        <h2 className="section-title">Explore Space Data</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              to={feature.link} 
              key={index} 
              className={`feature-card ${feature.hasError ? 'feature-error' : ''}`}
              style={{ '--card-color': feature.color }}
            >
              <div className="feature-header">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={feature.hasError ? faExclamationTriangle : feature.icon} />
                </div>
                <div className="feature-stats">{feature.stats}</div>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="explore-link">
                {feature.hasError ? 'View Anyway' : 'Explore'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mission Statistics */}
      {!loading && !hasAnyErrors && (
        <div className="stats-section">
          <AnimatedStats 
            asteroidData={asteroidData}
            marsPhotos={marsPhotos}
            currentAPOD={apodData}
          />
        </div>
      )}

      {/* Toggle Dashboard Button */}
      {!loading && (asteroidData.length > 0 || marsPhotos.length > 0) && (
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
      )}

      {/* Data Dashboard */}
      {!loading && showDashboard && (asteroidData.length > 0 || marsPhotos.length > 0) && (
        <div className="dashboard-section">
          <DataDashboard
            asteroidData={asteroidData}
            marsPhotos={marsPhotos}
            apodHistory={apodData ? [apodData] : []}
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