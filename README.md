NASA Data Explorer

A full-stack web application that brings the wonders of space to your browser through NASA's public APIs. This project features a polished, space-themed interface with interactive data visualisations, allowing users to explore astronomy pictures, Mars rover photographs, and near-Earth asteroid information.

Table of Contents
Overview
Features
Technical Stack
Prerequisites
Installation
Running the Application
Project Structure
API Endpoints
Environment Variables
Deployment
Known Issues
Future Enhancements
Contributing
Licence

Overview
The NASA Data Explorer is a comprehensive web application built as part of a software engineering challenge. It demonstrates proficiency in modern web development by integrating multiple NASA APIs into an engaging user experience. The application features a React frontend with advanced data visualisations and a Node.js/Express backend that serves as an intermediary between the client and NASA's services.

Features
Core Functionality
Astronomy Picture of the Day (APOD)

Daily astronomical images with detailed descriptions
Date navigation to explore historical images
Automatic fallback for days when images are not yet available
Mars Rover Photographs

Browse images from NASA's Mars rovers
Filter by Martian sol (day) using an interactive slider
Camera selection for different perspectives
Near-Earth Asteroids Tracker

Real-time data on asteroids approaching Earth
Hazard assessment and tracking
Detailed information including size, velocity, and approach distance
Data Visualisations
Animated Statistics Dashboard

Six key metrics with smooth animations
Real-time counting effects using CountUp library
Responsive grid layout
Interactive Charts

Asteroid size distribution (doughnut chart)
Hazard timeline tracking (line chart)
Mars camera usage statistics (bar chart)
Comprehensive space data overview (radar chart)
User Experience
Glass morphism design aesthetic
Animated starfield backgrounds
Smooth page transitions
Fully responsive layout for all devices
Font Awesome icons throughout
Loading states and error handling
Technical Stack
Frontend
React (17.0.2) - Component-based UI library
React Router (6.x) - Client-side routing
Axios - HTTP client for API requests
Chart.js & react-chartjs-2 - Data visualisation
Font Awesome - Icon library
CountUp - Number animation library
CSS3 - Styling with animations and transitions
Backend
Node.js - JavaScript runtime
Express (4.x) - Web application framework
Axios - HTTP client for NASA API requests
CORS - Cross-origin resource sharing
dotenv - Environment variable management
APIs
NASA Open APIs
Astronomy Picture of the Day (APOD)
Mars Rover Photos
Near Earth Object Web Service (NeoWs)
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14.0.0 or later)
npm (v6.0.0 or later)

Git
Installation

Clone the repository:
```
git clone https://github.com/kyleoneill20/nasa-data-explorer.git
cd nasa-data-explorer
```
Install backend dependencies:
```
cd backend
npm install
```
Install frontend dependencies:
```
cd ../frontend
npm install
```
Running the Application
Development Mode
Start the backend server (runs on port 5001):
```
cd backend
npm start
```
In a new terminal, start the frontend development server (runs on port 3000):
```
cd frontend
npm start
```
Open your browser and navigate to http://localhost:3000
Production Build
To create a production build of the frontend:

```
cd frontend
npm run build
```
Project Structure
```
nasa-data-explorer/
├── backend/
│   ├── server.js              # Express server configuration
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables 
│   └── routes/
│       ├── apod.js           # APOD endpoint handlers
│       ├── marsPhotos.js     # Mars photos endpoint handlers
│       └── asteroids.js      # Asteroids endpoint handlers
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── APOD.js
│   │   │   ├── MarsPhotos.js
│   │   │   ├── Asteroids.js
│   │   │   ├── Home.js
│   │   │   ├── Navigation.js
│   │   │   ├── AnimatedStats.js
│   │   │   └── DataDashboard.js
│   │   ├── services/
│   │   │   └── nasaService.js  # API service layer
│   │   ├── styles/             # Component-specific CSS
│   │   ├── App.js             # Main application component
│   │   └── index.js           # Application entry point
│   └── package.json           # Frontend dependencies
└── README.md
```
API Endpoints
Backend Endpoints
`GET /api/apod` - Fetch Astronomy Picture of the Day
Query parameters: `date` (YYYY-MM-DD format)
`GET /api/mars-photos` - Fetch Mars rover photos
Query parameters: `sol` (Martian day), `camera` (optional)
`GET /api/asteroids` - Fetch near-Earth asteroid data
Query parameters: `start_date`, `end_date` (YYYY-MM-DD format)
Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
NASA_API_KEY=your_nasa_api_key_here
PORT=5001
```
To obtain a NASA API key:

Visit https://api.nasa.gov/
Register for a free API key
Replace `your_nasa_api_key_here` with your actual key
Deployment
Frontend (Vercel)
Install Vercel CLI: `npm i -g vercel`
Run `vercel` in the frontend directory
Follow the prompts to deploy
Backend (Render)
Create a new Web Service on Render
Connect your GitHub repository
Set the build command: `npm install`
Set the start command: `npm start`
Add environment variables in the Render dashboard

Licence
This project is licenced under the MIT Licence.

Built by Kyle O'Neill | Powered by NASA Open API
