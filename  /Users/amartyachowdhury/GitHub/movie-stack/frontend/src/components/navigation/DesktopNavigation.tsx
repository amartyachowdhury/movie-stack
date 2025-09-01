import React from 'react';
import './DesktopNavigation.css';

const DesktopNavigation: React.FC = () => {
  return (
    <nav className="desktop-navigation" aria-label="Primary Navigation">
      <div className="desktop-navigation__brand">Movie Stack</div>
      <ul className="desktop-navigation__items">
        <li className="desktop-navigation__item">Home</li>
        <li className="desktop-navigation__item">Watchlist</li>
        <li className="desktop-navigation__item">Recommendations</li>
        <li className="desktop-navigation__item">Profile</li>
      </ul>
    </nav>
  );
};

export default DesktopNavigation;
