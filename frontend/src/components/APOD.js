import React, { useState, useEffect } from 'react';
import nasaService from '../services/nasaService';
import '../styles/APOD.css';

const APOD = () => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get today's date in the correct format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Attempting to fetch APOD for date:', selectedDate);
        const data = await nasaService.getAPOD(selectedDate);
        setApodData(data);
      } catch (err) {
        console.error('Error fetching APOD:', err);
        
        // If today's image isn't available yet, try yesterday
        if (selectedDate === getTodayDate()) {
          console.log("Today's APOD not available yet, trying yesterday...");
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const year = yesterday.getFullYear();
          const month = String(yesterday.getMonth() + 1).padStart(2, '0');
          const day = String(yesterday.getDate()).padStart(2, '0');
          const yesterdayStr = `${year}-${month}-${day}`;
          
          try {
            const yesterdayData = await nasaService.getAPOD(yesterdayStr);
            setApodData(yesterdayData);
            setSelectedDate(yesterdayStr);
            setError("Today's image isn't available yet. Showing yesterday's image.");
          } catch (yesterdayErr) {
            setError('Failed to fetch astronomy picture. Please try again later.');
          }
        } else {
          setError('Failed to fetch astronomy picture for this date.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const today = getTodayDate();
    
    // Prevent selecting future dates
    if (newDate > today) {
      alert("Cannot select future dates for APOD");
      return;
    }
    
    setSelectedDate(newDate);
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;
    const today = getTodayDate();
    
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="apod-container">
        <div className="apod-loading">
          <div className="loading-spinner"></div>
          Loading cosmic wonders...
        </div>
      </div>
    );
  }

  if (!apodData && error) {
    return (
      <div className="apod-container">
        <div className="apod-error">
          <p>{error}</p>
          <button 
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const year = yesterday.getFullYear();
              const month = String(yesterday.getMonth() + 1).padStart(2, '0');
              const day = String(yesterday.getDate()).padStart(2, '0');
              setSelectedDate(`${year}-${month}-${day}`);
            }} 
            className="apod-nav-button"
            style={{ marginTop: '20px' }}
          >
            Try Yesterday's Picture
          </button>
        </div>
      </div>
    );
  }

  if (!apodData) {
    return (
      <div className="apod-container">
        <div className="apod-error">No data available</div>
      </div>
    );
  }

  const isToday = selectedDate === getTodayDate();

  return (
    <div className="apod-container">
      <div className="apod-content">
        <h1 className="apod-title">Astronomy Picture of the Day</h1>
        
        {error && (
          <div className="apod-notice" style={{
            background: 'rgba(255, 165, 0, 0.2)',
            border: '1px solid rgba(255, 165, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <p className="apod-date">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="apod-navigation">
          <button 
            onClick={goToPreviousDay}
            className="apod-nav-button"
            disabled={loading}
          >
            ← Previous Day
          </button>
          
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={getTodayDate()}
            className="apod-nav-button"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              cursor: 'pointer'
            }}
          />
          
          <button 
            onClick={goToNextDay}
            className="apod-nav-button"
            disabled={loading || isToday}
          >
            Next Day →
          </button>
        </div>

        {apodData.media_type === 'image' ? (
          <div 
            className={`apod-image-container ${isFullscreen ? 'fullscreen' : ''}`}
            onClick={toggleFullscreen}
            style={{ cursor: isFullscreen ? 'zoom-out' : 'zoom-in' }}
          >
            <img 
              src={apodData.url} 
              alt={apodData.title} 
              className="apod-image" 
            />
          </div>
        ) : (
          <div className="apod-video-container">
            <iframe
              src={apodData.url}
              title={apodData.title}
              allowFullScreen
            />
          </div>
        )}

        <div className="apod-info">
          <h2>{apodData.title}</h2>
          <p className="apod-explanation">{apodData.explanation}</p>
        </div>

        {apodData.copyright && (
          <p className="apod-copyright">
            Image Credit & Copyright: {apodData.copyright}
          </p>
        )}
      </div>
    </div>
  );
};

export default APOD;