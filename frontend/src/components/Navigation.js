import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faImage,
  faRocket,
  faMeteor
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: faHome },
    { path: '/apod', label: 'Picture of the Day', icon: faImage },
    { path: '/mars-photos', label: 'Mars Rover', icon: faRocket },
    { path: '/asteroids', label: 'Asteroids', icon: faMeteor }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <FontAwesomeIcon icon={faRocket} className="nav-logo" />
        <span>NASA Explorer</span>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;