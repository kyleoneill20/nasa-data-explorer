import React, { useState, useEffect, useCallback } from 'react';
import { getAsteroids } from '../services/nasaService';
import '../styles/Asteroids.css';

const Asteroids = () => {
  const [selectedRange, setSelectedRange] = useState('today');
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [elementCount, setElementCount] = useState(0);

  const dateRanges = {
    today: {
      label: 'Today',
      description: 'Current threats',
      getRange: () => {
        const date = new Date();
        return { start: date, end: date };
      }
    },
    tomorrow: {
      label: 'Tomorrow',
      description: 'Upcoming encounters',
      getRange: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return { start: date, end: date };
      }
    },
    thisWeek: {
      label: 'Next 7 Days',
      description: 'Week ahead forecast',
      getRange: () => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 6);
        return { start, end };
      }
    },
    lastWeek: {
      label: 'Past 7 Days',
      description: 'Recent encounters',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        end.setDate(end.getDate() - 1);
        return { start, end };
      }
    }
  };

  const fetchAsteroids = useCallback(async (rangeKey) => {
    const range = dateRanges[rangeKey].getRange();
    const startDate = range.start.toISOString().split('T')[0];
    const endDate = range.end.toISOString().split('T')[0];
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAsteroids(startDate, endDate);
      const asteroidList = [];
      
      if (data && data.near_earth_objects) {
        Object.keys(data.near_earth_objects).forEach(date => {
          data.near_earth_objects[date].forEach(asteroid => {
            asteroidList.push({ ...asteroid, approach_date: date });
          });
        });
      }
      
      asteroidList.sort((a, b) => new Date(a.approach_date) - new Date(b.approach_date));
      
      setAsteroids(asteroidList);
      setElementCount(data.element_count || asteroidList.length);
    } catch (err) {
      setError('Failed to fetch asteroid data. Please try again.');
      console.error('Error fetching asteroids:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAsteroids(selectedRange);
  }, [selectedRange, fetchAsteroids]);

  const formatDistance = (km) => {
    const numKm = parseFloat(km);
    if (numKm < 1000000) {
      return new Intl.NumberFormat('en-US').format(Math.round(numKm)) + ' km';
    } else {
      return (numKm / 1000000).toFixed(2) + 'M km';
    }
  };

  const formatVelocity = (kmh) => {
    const numKmh = parseFloat(kmh);
    return new Intl.NumberFormat('en-US').format(Math.round(numKmh)) + ' km/h';
  };

  const getHazardLevel = (asteroid) => {
    if (!asteroid.is_potentially_hazardous_asteroid) return 'safe';
    const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers);
    if (distance < 2000000) return 'high';
    if (distance < 5000000) return 'medium';
    return 'low';
  };

  return (
    <div className="asteroids">
      <div className="asteroids-header">
        <h2>Near-Earth Asteroids</h2>
        <p className="asteroids-subtitle">Tracking objects in Earth's cosmic neighborhood</p>
      </div>
      
      <div className="timeline-container">
        <div className="timeline-nav">
          {Object.entries(dateRanges).map(([key, range]) => (
            <button
              key={key}
              className={`timeline-btn ${selectedRange === key ? 'active' : ''}`}
              onClick={() => setSelectedRange(key)}
            >
              <div className="timeline-btn-content">
                <span className="btn-label">{range.label}</span>
                <span className="btn-description">{range.description}</span>
              </div>
              {selectedRange === key && <div className="active-indicator"></div>}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Scanning for asteroids...</p>
        </div>
      )}
      
      {!loading && !error && asteroids.length > 0 && (
        <>
          <div className="stats-container">
            <div className="stat-card total">
              <div className="stat-value">{elementCount}</div>
              <div className="stat-label">Total Objects</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="stat-card hazardous">
              <div className="stat-value">
                {asteroids.filter(a => a.is_potentially_hazardous_asteroid).length}
              </div>
              <div className="stat-label">Potentially Hazardous</div>
              <div className="stat-bar">
                <div 
                  className="stat-fill danger" 
                  style={{ 
                    width: `${(asteroids.filter(a => a.is_potentially_hazardous_asteroid).length / elementCount) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="asteroids-list">
            {asteroids.map((asteroid) => {
              const hazardLevel = getHazardLevel(asteroid);
              return (
                <div 
                  key={asteroid.id} 
                  className={`asteroid-card ${hazardLevel}`}
                >
                  <div className="asteroid-header">
                    <h3>{asteroid.name}</h3>
                    {asteroid.is_potentially_hazardous_asteroid && (
                      <span className={`hazard-indicator ${hazardLevel}`}>
                        {hazardLevel.toUpperCase()} RISK
                      </span>
                    )}
                  </div>
                  
                  <div className="asteroid-metrics">
                    <div className="metric">
                      <span className="metric-label">Size</span>
                      <span className="metric-value">
                        {Math.round(asteroid.estimated_diameter.meters.estimated_diameter_min)} - 
                        {Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max)} m
                      </span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Distance</span>
                      <span className="metric-value">
                        {formatDistance(asteroid.close_approach_data[0].miss_distance.kilometers)}
                      </span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Speed</span>
                      <span className="metric-value">
                        {formatVelocity(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)}
                      </span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Approach</span>
                      <span className="metric-value">
                        {new Date(asteroid.close_approach_data[0].close_approach_date_full).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {!loading && !error && asteroids.length === 0 && (
        <div className="no-data-container">
          <div className="no-data-message">
            <p>No asteroids detected</p>
            <p className="no-data-detail">for {dateRanges[selectedRange].label.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asteroids;