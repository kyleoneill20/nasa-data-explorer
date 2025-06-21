import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import './DataDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const DataDashboard = ({ asteroidData, marsPhotos, apodHistory }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate asteroid size distribution
  const getAsteroidSizeData = () => {
    const sizes = {
      'Tiny (< 0.1 km)': 0,
      'Small (0.1-0.5 km)': 0,
      'Medium (0.5-1 km)': 0,
      'Large (> 1 km)': 0
    };

    asteroidData.forEach(asteroid => {
      const size = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
      if (size < 0.1) sizes['Tiny (< 0.1 km)']++;
      else if (size < 0.5) sizes['Small (0.1-0.5 km)']++;
      else if (size < 1) sizes['Medium (0.5-1 km)']++;
      else sizes['Large (> 1 km)']++;
    });

    return {
      labels: Object.keys(sizes),
      datasets: [{
        label: 'Asteroid Size Distribution',
        data: Object.values(sizes),
        backgroundColor: [
          'rgba(102, 126, 234, 0.6)',
          'rgba(118, 75, 162, 0.6)',
          'rgba(237, 117, 99, 0.6)',
          'rgba(246, 109, 155, 0.6)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(237, 117, 99, 1)',
          'rgba(246, 109, 155, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  // Get hazard timeline data
  const getHazardTimelineData = () => {
    const dates = [...new Set(asteroidData.map(a => 
      a.close_approach_data[0].close_approach_date
    ))].sort();

    const hazardousByDate = dates.map(date => {
      return asteroidData.filter(a => 
        a.close_approach_data[0].close_approach_date === date && 
        a.is_potentially_hazardous_asteroid
      ).length;
    });

    const safeByDate = dates.map(date => {
      return asteroidData.filter(a => 
        a.close_approach_data[0].close_approach_date === date && 
        !a.is_potentially_hazardous_asteroid
      ).length;
    });

    return {
      labels: dates.map(d => new Date(d).toLocaleDateString()),
      datasets: [
        {
          label: 'Hazardous',
          data: hazardousByDate,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        },
        {
          label: 'Safe',
          data: safeByDate,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    };
  };

  // Mars camera distribution
  const getMarsRoverData = () => {
    const cameraCount = {};
    marsPhotos.forEach(photo => {
      const camera = photo.camera.full_name;
      cameraCount[camera] = (cameraCount[camera] || 0) + 1;
    });

    return {
      labels: Object.keys(cameraCount),
      datasets: [{
        label: 'Photos by Camera',
        data: Object.values(cameraCount),
        backgroundColor: [
          'rgba(255, 107, 107, 0.6)',
          'rgba(255, 142, 83, 0.6)',
          'rgba(255, 177, 59, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 235, 113, 0.6)'
        ],
        borderWidth: 2
      }]
    };
  };

  // Space overview radar chart
  const getSpaceOverviewData = () => {
    const hazardCount = asteroidData.filter(a => a.is_potentially_hazardous_asteroid).length;
    const avgSize = asteroidData.reduce((sum, a) => 
      sum + a.estimated_diameter.kilometers.estimated_diameter_max, 0
    ) / asteroidData.length;

    return {
      labels: [
        'Total Asteroids',
        'Hazardous Objects',
        'Avg Size (km)',
        'Mars Photos',
        'Unique Cameras',
        'Days Covered'
      ],
      datasets: [{
        label: 'Space Data Metrics',
        data: [
          asteroidData.length,
          hazardCount,
          avgSize * 10,
          marsPhotos.length / 10,
          [...new Set(marsPhotos.map(p => p.camera.name))].length * 10,
          [...new Set(asteroidData.map(a => a.close_approach_data[0].close_approach_date))].length * 10
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: 'rgba(102, 126, 234, 1)',
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
      }]
    };
  };

  return (
    <div className="data-dashboard">
      <div className="dashboard-header">
        <h2>🚀 Space Data Analytics</h2>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'asteroids' ? 'active' : ''}
            onClick={() => setActiveTab('asteroids')}
          >
            Asteroids
          </button>
          <button 
            className={activeTab === 'mars' ? 'active' : ''}
            onClick={() => setActiveTab('mars')}
          >
            Mars
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="charts-grid">
          <div className="chart-container radar-chart">
            <h3>Space Data Overview</h3>
            <Radar data={getSpaceOverviewData()} options={{
              plugins: {
                legend: { display: false }
              },
              scales: {
                r: {
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { display: false }
                }
              }
            }} />
          </div>
          
          <div className="chart-container doughnut-chart">
            <h3>Asteroid Size Distribution</h3>
            <Doughnut data={getAsteroidSizeData()} options={{
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: 'white' }
                }
              }
            }} />
          </div>
        </div>
      )}

      {activeTab === 'asteroids' && (
        <div className="charts-grid">
          <div className="chart-container line-chart">
            <h3>Asteroid Approach Timeline</h3>
            <Line data={getHazardTimelineData()} options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: 'white' }
                }
              },
              scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'white' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'white' } }
              }
            }} />
          </div>
          
          <div className="chart-container polar-chart">
            <h3>Hazard Distribution</h3>
            <PolarArea data={{
              labels: ['Hazardous', 'Safe'],
              datasets: [{
                data: [
                  asteroidData.filter(a => a.is_potentially_hazardous_asteroid).length,
                  asteroidData.filter(a => !a.is_potentially_hazardous_asteroid).length
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(75, 192, 192, 0.6)'
                ]
              }]
            }} />
          </div>
        </div>
      )}

      {activeTab === 'mars' && (
        <div className="charts-grid">
          <div className="chart-container bar-chart">
            <h3>Mars Camera Usage</h3>
            <Bar data={getMarsRoverData()} options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'white' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'white' } }
              }
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataDashboard;