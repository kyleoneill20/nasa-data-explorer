import React from 'react';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMeteor, 
  faExclamationTriangle, 
  faRuler, 
  faCircle, 
  faCamera, 
  faImage,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import '../styles/AnimatedStats.css';

const AnimatedStats = ({ asteroidData = [], marsPhotos = [], currentAPOD = null }) => {
  const calculateStats = () => {
    if (!asteroidData.length) {
      return [
        { title: 'Total Near-Earth Objects', value: 0, icon: faMeteor, color: '#667eea', suffix: '', description: 'Loading...' },
        { title: 'Hazardous Asteroids', value: 0, icon: faExclamationTriangle, color: '#f56565', suffix: '', description: 'Loading...' },
        { title: 'Closest Approach', value: 0, icon: faRuler, color: '#48bb78', suffix: ' km', description: 'Loading...' },
        { title: 'Largest Asteroid', value: 0, icon: faCircle, color: '#ed8936', suffix: ' km', description: 'Loading...' },
        { title: 'Mars Photos', value: 0, icon: faCamera, color: '#e53e3e', suffix: '', description: 'Loading...' },
        { title: "Today's APOD", value: 0, icon: faImage, color: '#3182ce', suffix: '', description: 'Loading...' }
      ];
    }

    const hazardousCount = asteroidData.filter(a => a.is_potentially_hazardous_asteroid).length;
    const closestApproach = asteroidData.length > 0 
      ? Math.min(...asteroidData.map(a => parseFloat(a.close_approach_data[0].miss_distance.kilometers)))
      : 0;
    const largestAsteroid = asteroidData.length > 0
      ? Math.max(...asteroidData.map(a => a.estimated_diameter.kilometers.estimated_diameter_max))
      : 0;
    const uniqueCameras = marsPhotos.length > 0 
      ? [...new Set(marsPhotos.map(p => p.camera.name))].length 
      : 0;

    return [
      {
        title: 'Total Near-Earth Objects',
        value: asteroidData.length,
        icon: faMeteor,
        color: '#667eea',
        suffix: '',
        description: 'Tracked this week'
      },
      {
        title: 'Hazardous Asteroids',
        value: hazardousCount,
        icon: faExclamationTriangle,
        color: '#f56565',
        suffix: '',
        description: 'Potentially dangerous'
      },
      {
        title: 'Closest Approach',
        value: Math.round(closestApproach),
        icon: faRuler,
        color: '#48bb78',
        suffix: ' km',
        description: 'Nearest distance'
      },
      {
        title: 'Largest Asteroid',
        value: largestAsteroid,
        icon: faCircle,
        color: '#ed8936',
        suffix: ' km',
        decimals: 2,
        description: 'Maximum diameter'
      },
      {
        title: 'Mars Photos',
        value: marsPhotos.length,
        icon: faCamera,
        color: '#e53e3e',
        suffix: '',
        description: `From ${uniqueCameras} cameras`
      },
      {
        title: "Today's APOD",
        value: currentAPOD ? 1 : 0,
        icon: faImage,
        color: '#3182ce',
        suffix: '',
        description: currentAPOD ? 'Available' : 'Not loaded'
      }
    ];
  };

  const stats = calculateStats();

  return (
    <div className="animated-stats-container">
      <h2 className="stats-title">Mission Statistics</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ 
              '--accent-color': stat.color,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="stat-icon-wrapper">
              <FontAwesomeIcon 
                icon={stat.icon} 
                className="stat-icon"
              />
            </div>
            
            <h3 className="stat-title">{stat.title}</h3>
            
            <div className="stat-value">
              <CountUp
                start={0}
                end={stat.value}
                duration={2.5}
                separator=","
                decimals={stat.decimals || 0}
                suffix={stat.suffix}
              />
            </div>
            
            <p className="stat-description">{stat.description}</p>
            
            <div className="stat-progress">
              <div 
                className="progress-bar"
                style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedStats;