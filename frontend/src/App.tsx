import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { ThemeProvider } from './shared/ThemeContext';
import { AnimationProvider } from './shared/AnimationContext';
import ErrorBoundary from './shared/components/ErrorBoundary';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import UserProfile from './features/user/components/UserProfile';
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import WatchlistManager from './features/watchlist/components/WatchlistManager';
import SmartRecommendations from './features/recommendations/components/SmartRecommendations';
import MovieTrailers from './features/movies/components/MovieTrailers';
import ThemeCustomizer from './shared/components/ThemeCustomizer';
import AnalyticsDashboard from './features/analytics/components/AnalyticsDashboard';
import ToastContainer from './shared/components/ToastContainer';
import IntegratedNavigation from './shared/components/navigation/IntegratedNavigation';
import './shared/design-tokens.css';
import './shared/theme.css';
import './shared/animations.css';
import './App.css';

// Register service worker for PWA functionality
import * as serviceWorker from './serviceWorker';

// Analytics and Monitoring Services
import analyticsService from './features/analytics/services/analyticsService';
import monitoringService from './features/analytics/services/monitoringService';
import { trackCommonActions } from './features/analytics/services/analyticsService';

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  // Initialize analytics and monitoring
  useEffect(() => {
    // Set user ID for analytics if user is logged in
    if (user) {
      analyticsService.setUserId(user.id);
    }

    // Track page view
    analyticsService.trackPageView(window.location.pathname);

    // Register service worker for PWA features in production only
    if (process.env.NODE_ENV === 'production') {
      serviceWorker.register({
        onSuccess: (registration) => {
          console.log('Service Worker registered successfully:', registration);
          analyticsService.trackSystemHealth('service_worker_registered', 1, 'success');
        },
        onUpdate: (registration) => {
          console.log('New content is available; please refresh.');
          analyticsService.trackSystemHealth('service_worker_update', 1, 'available');
          
          // Don't automatically reload - let user decide when to refresh
          // The service worker will update in the background
        }
      });
    }

    // Cleanup on unmount
    return () => {
      analyticsService.destroy();
      monitoringService.destroy();
    };
  }, [user]);

  return (
    <div className="App">
      {/* Navigation Components */}
      <IntegratedNavigation />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/watchlist" element={
          user ? <WatchlistManager userId={user.id} /> : <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        } />
        <Route path="/recommendations" element={
          user ? <SmartRecommendations userId={user.id} /> : <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        } />
        <Route path="/analytics" element={
          user ? <AnalyticsDashboard userId={user.id} onMovieClick={(movie) => navigate(`/movie/${movie.id}`)} /> : <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        } />
        <Route path="/profile" element={
          user ? <UserProfile /> : <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        } />
        <Route path="/login" element={<LoginForm onSwitchToRegister={handleSwitchToRegister} />} />
        <Route path="/register" element={<RegisterForm onSwitchToLogin={handleSwitchToLogin} />} />
      </Routes>

      {/* Theme Customizer Modal */}
      <ThemeCustomizer 
        isOpen={showThemeCustomizer} 
        onClose={() => setShowThemeCustomizer(false)} 
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" maxToasts={3} />

      {/* Global Theme Customizer Trigger */}
      <button 
        className="theme-customizer-trigger"
        onClick={() => setShowThemeCustomizer(true)}
        title="Customize Theme"
      >
        🎨
      </button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AnimationProvider>
              <AppContent />
            </AnimationProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
