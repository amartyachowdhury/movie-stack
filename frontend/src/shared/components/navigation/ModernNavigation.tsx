import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth';
import { useAnimation, useMicroInteractions } from '../../../shared/hooks';
import './ModernNavigation.css';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  requiresAuth?: boolean;
  description?: string;
}

interface ModernNavigationProps {
  className?: string;
}

const ModernNavigation: React.FC<ModernNavigationProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { startTransition } = useAnimation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      description: 'Discover trending movies'
    },
    {
      id: 'search',
      label: 'Search',
      path: '/search',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      description: 'Find your next favorite movie'
    },
    {
      id: 'watchlist',
      label: 'Watchlist',
      path: '/watchlist',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
        </svg>
      ),
      badge: 0, // TODO: Get actual watchlist count
      requiresAuth: true,
      description: 'Your saved movies'
    },
    {
      id: 'recommendations',
      label: 'Discover',
      path: '/recommendations',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      ),
      requiresAuth: true,
      description: 'AI-powered recommendations'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      ),
      requiresAuth: true,
      description: 'Your viewing insights'
    }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search focus
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Check if route is active
  const isActiveRoute = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Handle navigation
  const handleNavigation = useCallback((path: string) => {
    startTransition(() => {
      navigate(path);
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
    });
  }, [navigate, startTransition]);

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNavigation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  }, [searchQuery, handleNavigation]);

  // Handle dropdown hover
  const handleDropdownEnter = useCallback((itemId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(itemId);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  // Get micro-interactions
  const getMicroInteractions = useCallback((itemId: string) => {
    return useMicroInteractions({
      hoverDelay: 0,
      animationDuration: 200,
      enableRipple: true,
      enableHover: true,
      enablePress: true,
      enableFocus: true
    });
  }, []);

  // Filter navigation items based on auth status
  const visibleItems = navigationItems.filter(item => 
    !item.requiresAuth || user
  );

  return (
    <nav 
      ref={navRef}
      className={`modern-navigation ${isScrolled ? 'modern-navigation--scrolled' : ''} ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="modern-navigation__container">
        {/* Logo/Brand */}
        <div className="modern-navigation__brand">
          <button
            className="modern-navigation__brand-button"
            onClick={() => handleNavigation('/')}
            aria-label="Go to homepage"
            {...getMicroInteractions('brand')}
          >
            <div className="modern-navigation__brand-icon">
              🎬
            </div>
            <span className="modern-navigation__brand-text">MovieStack</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="modern-navigation__desktop">
          <ul className="modern-navigation__nav-list" role="menubar">
            {visibleItems.map((item) => (
              <li key={item.id} className="modern-navigation__nav-item" role="none">
                <button
                  className={`modern-navigation__nav-button ${
                    isActiveRoute(item.path) ? 'modern-navigation__nav-button--active' : ''
                  }`}
                  onClick={() => handleNavigation(item.path)}
                  onMouseEnter={() => handleDropdownEnter(item.id)}
                  onMouseLeave={handleDropdownLeave}
                  aria-label={item.description || item.label}
                  aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                  role="menuitem"
                  {...getMicroInteractions(item.id)}
                >
                  <span className="modern-navigation__nav-icon">
                    {item.icon}
                  </span>
                  <span className="modern-navigation__nav-label">
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="modern-navigation__nav-badge" aria-label={`${item.badge} items`}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
                
                {/* Tooltip */}
                {item.description && (
                  <div className={`modern-navigation__tooltip ${
                    activeDropdown === item.id ? 'modern-navigation__tooltip--visible' : ''
                  }`}>
                    {item.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Search */}
        <div className="modern-navigation__search">
          {showSearch ? (
            <form onSubmit={handleSearch} className="modern-navigation__search-form">
              <div className="modern-navigation__search-input-container">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="modern-navigation__search-input"
                  aria-label="Search movies"
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="modern-navigation__search-close"
                  aria-label="Close search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </form>
          ) : (
            <button
              className="modern-navigation__search-toggle"
              onClick={() => setShowSearch(true)}
              aria-label="Open search"
              {...getMicroInteractions('search-toggle')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          )}
        </div>

        {/* User Menu */}
        <div className="modern-navigation__user">
          {user ? (
            <div className="modern-navigation__user-menu">
              <button
                className="modern-navigation__user-button"
                onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                aria-label="User menu"
                aria-expanded={activeDropdown === 'user' ? 'true' : 'false'}
                {...getMicroInteractions('user-menu')}
              >
                <div className="modern-navigation__user-avatar">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.username}'s avatar`}
                      className="modern-navigation__user-avatar-image"
                    />
                  ) : (
                    <span className="modern-navigation__user-avatar-initial">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="modern-navigation__user-name">
                  {user.username}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={`modern-navigation__user-chevron ${
                    activeDropdown === 'user' ? 'modern-navigation__user-chevron--open' : ''
                  }`}
                >
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </button>

              {/* User Dropdown */}
              <div className={`modern-navigation__user-dropdown ${
                activeDropdown === 'user' ? 'modern-navigation__user-dropdown--visible' : ''
              }`}>
                <div className="modern-navigation__user-info">
                  <div className="modern-navigation__user-info-name">
                    {user.username}
                  </div>
                  <div className="modern-navigation__user-info-email">
                    {user.email}
                  </div>
                </div>
                
                <div className="modern-navigation__user-actions">
                  <button
                    className="modern-navigation__user-action"
                    onClick={() => handleNavigation('/profile')}
                    {...getMicroInteractions('profile')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </button>
                  
                  <button
                    className="modern-navigation__user-action"
                    onClick={() => handleNavigation('/analytics')}
                    {...getMicroInteractions('analytics')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18"/>
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                    </svg>
                    Analytics
                  </button>
                  
                  <hr className="modern-navigation__user-divider" />
                  
                  <button
                    className="modern-navigation__user-action modern-navigation__user-action--danger"
                    onClick={logout}
                    {...getMicroInteractions('logout')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16,17 21,12 16,7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="modern-navigation__auth">
              <button
                className="modern-navigation__auth-button modern-navigation__auth-button--login"
                onClick={() => handleNavigation('/login')}
                {...getMicroInteractions('login')}
              >
                Sign In
              </button>
              <button
                className="modern-navigation__auth-button modern-navigation__auth-button--register"
                onClick={() => handleNavigation('/register')}
                {...getMicroInteractions('register')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="modern-navigation__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
          {...getMicroInteractions('mobile-toggle')}
        >
          <span className={`modern-navigation__hamburger ${
            isMobileMenuOpen ? 'modern-navigation__hamburger--open' : ''
          }`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`modern-navigation__mobile-menu ${
        isMobileMenuOpen ? 'modern-navigation__mobile-menu--open' : ''
      }`}>
        <div className="modern-navigation__mobile-content">
          {/* Mobile Search */}
          <div className="modern-navigation__mobile-search">
            <form onSubmit={handleSearch} className="modern-navigation__mobile-search-form">
              <div className="modern-navigation__mobile-search-input-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="modern-navigation__mobile-search-input"
                  aria-label="Search movies"
                />
                <button
                  type="submit"
                  className="modern-navigation__mobile-search-submit"
                  aria-label="Search"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Navigation Items */}
          <ul className="modern-navigation__mobile-nav-list">
            {visibleItems.map((item) => (
              <li key={item.id} className="modern-navigation__mobile-nav-item">
                <button
                  className={`modern-navigation__mobile-nav-button ${
                    isActiveRoute(item.path) ? 'modern-navigation__mobile-nav-button--active' : ''
                  }`}
                  onClick={() => handleNavigation(item.path)}
                  aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                  {...getMicroInteractions(`mobile-${item.id}`)}
                >
                  <span className="modern-navigation__mobile-nav-icon">
                    {item.icon}
                  </span>
                  <div className="modern-navigation__mobile-nav-content">
                    <span className="modern-navigation__mobile-nav-label">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="modern-navigation__mobile-nav-description">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="modern-navigation__mobile-nav-badge">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile User Section */}
          {user ? (
            <div className="modern-navigation__mobile-user">
              <div className="modern-navigation__mobile-user-info">
                <div className="modern-navigation__mobile-user-avatar">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.username}'s avatar`}
                      className="modern-navigation__mobile-user-avatar-image"
                    />
                  ) : (
                    <span className="modern-navigation__mobile-user-avatar-initial">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="modern-navigation__mobile-user-details">
                  <div className="modern-navigation__mobile-user-name">
                    {user.username}
                  </div>
                  <div className="modern-navigation__mobile-user-email">
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="modern-navigation__mobile-user-actions">
                <button
                  className="modern-navigation__mobile-user-action"
                  onClick={() => handleNavigation('/profile')}
                  {...getMicroInteractions('mobile-profile')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profile
                </button>
                
                <button
                  className="modern-navigation__mobile-user-action modern-navigation__mobile-user-action--danger"
                  onClick={logout}
                  {...getMicroInteractions('mobile-logout')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="modern-navigation__mobile-auth">
              <button
                className="modern-navigation__mobile-auth-button modern-navigation__mobile-auth-button--login"
                onClick={() => handleNavigation('/login')}
                {...getMicroInteractions('mobile-login')}
              >
                Sign In
              </button>
              <button
                className="modern-navigation__mobile-auth-button modern-navigation__mobile-auth-button--register"
                onClick={() => handleNavigation('/register')}
                {...getMicroInteractions('mobile-register')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="modern-navigation__mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default ModernNavigation;
