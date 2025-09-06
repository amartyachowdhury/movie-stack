import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/AuthContext';
import { Button } from '../ui';
import './IntegratedNavigation.css';

interface IntegratedNavigationProps {
  className?: string;
}

const IntegratedNavigation: React.FC<IntegratedNavigationProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return null; // Don't show navigation for non-authenticated users
  }

  const baseClasses = 'integrated-navigation';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <div className="integrated-navigation__container">
        {/* Left Section - Welcome & User Info */}
        <div className="integrated-navigation__left">
          <div className="integrated-navigation__welcome">
            <span className="integrated-navigation__welcome-text">
              Welcome, {user.username}!
            </span>
            <div className="integrated-navigation__avatar">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={`${user.username}'s avatar`}
                  className="integrated-navigation__avatar-image"
                />
              ) : (
                <span className="integrated-navigation__avatar-initial">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Navigation Links */}
        <nav className="integrated-navigation__center">
          <ul className="integrated-navigation__nav-list">
            <li className="integrated-navigation__nav-item">
              <Button
                variant={isActiveRoute('/watchlist') ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigate('/watchlist')}
                className="integrated-navigation__nav-button"
              >
                📋 Watchlist
              </Button>
            </li>
            <li className="integrated-navigation__nav-item">
              <Button
                variant={isActiveRoute('/recommendations') ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigate('/recommendations')}
                className="integrated-navigation__nav-button"
              >
                🤖 AI Recommendations
              </Button>
            </li>
            <li className="integrated-navigation__nav-item">
              <Button
                variant={isActiveRoute('/analytics') ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigate('/analytics')}
                className="integrated-navigation__nav-button"
              >
                📊 Analytics
              </Button>
            </li>
            <li className="integrated-navigation__nav-item">
              <Button
                variant={isActiveRoute('/profile') ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigate('/profile')}
                className="integrated-navigation__nav-button"
              >
                👤 Profile
              </Button>
            </li>
          </ul>
        </nav>

        {/* Right Section - Actions */}
        <div className="integrated-navigation__right">
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            className="integrated-navigation__logout-button"
          >
            🚪 Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default IntegratedNavigation;
