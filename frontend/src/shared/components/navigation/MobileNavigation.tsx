import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/AuthContext';
import { useAnimation } from '../../AnimationContext';
import { useMicroInteractions } from '../../hooks/useMicroInteractions';
import './MobileNavigation.css';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  requiresAuth?: boolean;
}

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startTransition } = useAnimation();
  const [activeTab, setActiveTab] = useState('/');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/'
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      path: '/search'
    },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: '📺',
      path: '/watchlist',
      requiresAuth: true,
      badge: 0 // TODO: Add watchlist count to user model
    },
    {
      id: 'recommendations',
      label: 'Discover',
      icon: '🎯',
      path: '/recommendations',
      requiresAuth: true
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/profile',
      requiresAuth: true
    }
  ];

  // Micro-interactions for navigation items
  const getMicroInteractions = (itemId: string) => {
    return useMicroInteractions({
      hoverDelay: 0,
      animationDuration: 200,
      enableRipple: true,
      enableHover: true,
      enablePress: true,
      enableFocus: true
    });
  };

  // Handle scroll to show/hide navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Hide navigation when scrolling down, show when scrolling up
      if (scrollDelta > 10 && currentScrollY > 100) {
        setIsVisible(false);
      } else if (scrollDelta < -10) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    setActiveTab(currentPath);
  }, [location.pathname]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - touchStartY.current;
    const deltaX = currentX - touchStartX.current;

    // Swipe up to show quick actions
    if (deltaY < -50 && Math.abs(deltaX) < 50) {
      setShowQuickActions(true);
    }
    
    // Swipe down to hide quick actions
    if (deltaY > 50 && Math.abs(deltaX) < 50) {
      setShowQuickActions(false);
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = 0;
    touchStartX.current = 0;
  };

  // Navigation item click handler
  const handleNavigationClick = (item: NavigationItem) => {
    if (item.requiresAuth && !user) {
      navigate('/login');
      return;
    }

    // Add haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Start page transition
    startTransition(item.path, 'forward', 'slide');
    
    // Navigate to the route
    navigate(item.path);
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'theme':
        // Toggle theme customizer
        break;
      case 'share':
        // Share current page
        if (navigator.share) {
          navigator.share({
            title: 'Movie Stack',
            url: window.location.href
          });
        }
        break;
      case 'back':
        navigate(-1);
        break;
      case 'home':
        navigate('/');
        break;
    }
    
    setShowQuickActions(false);
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav 
        ref={navRef}
        className={`mobile-navigation ${isVisible ? 'mobile-navigation--visible' : 'mobile-navigation--hidden'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mobile-navigation-container">
          {navigationItems.map((item) => {
            const microInteractions = getMicroInteractions(item.id);
            const isActive = activeTab === item.path;
            const isDisabled = item.requiresAuth && !user;

            return (
              <button
                key={item.id}
                className={`mobile-navigation-item ${isActive ? 'mobile-navigation-item--active' : ''} ${isDisabled ? 'mobile-navigation-item--disabled' : ''}`}
                disabled={isDisabled}
                {...microInteractions.handlers}
                onClick={() => handleNavigationClick(item)}
                ref={microInteractions.rippleRef as unknown as React.RefObject<HTMLButtonElement>}
              >
                <div className="mobile-navigation-icon">
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <span className="mobile-navigation-badge">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="mobile-navigation-label">{item.label}</span>
                
                {/* Ripple effect container */}
                <div className="mobile-navigation-ripple" />
              </button>
            );
          })}
        </div>

        {/* Quick Actions Panel */}
        {showQuickActions && (
          <div className="mobile-quick-actions">
            <div className="mobile-quick-actions-content">
              <button
                className="mobile-quick-action"
                onClick={() => handleQuickAction('theme')}
                aria-label="Theme Settings"
              >
                🎨
              </button>
              <button
                className="mobile-quick-action"
                onClick={() => handleQuickAction('share')}
                aria-label="Share"
              >
                📤
              </button>
              <button
                className="mobile-quick-action"
                onClick={() => handleQuickAction('back')}
                aria-label="Go Back"
              >
                ⬅️
              </button>
              <button
                className="mobile-quick-action"
                onClick={() => handleQuickAction('home')}
                aria-label="Go Home"
              >
                🏠
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Safe Area Spacer */}
      <div className="mobile-navigation-spacer" />
    </>
  );
};

export default MobileNavigation;
