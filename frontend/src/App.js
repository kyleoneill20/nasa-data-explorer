import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import APOD from './components/APOD';
import MarsPhotos from './components/MarsPhotos';
import Asteroids from './components/Asteroids';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apod" element={<APOD />} />
            <Route path="/mars-photos" element={<MarsPhotos />} />
            <Route path="/asteroids" element={<Asteroids />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;