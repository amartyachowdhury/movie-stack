import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import UserProfile from './components/UserProfile';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WatchlistManager from './components/WatchlistManager';
import SmartRecommendations from './components/SmartRecommendations';
import MovieTrailers from './components/MovieTrailers';
import ThemeCustomizer from './components/ThemeCustomizer';
import './styles/theme.css';
import './App.css';

// Register service worker for PWA functionality
import * as serviceWorker from './serviceWorker';

function AppContent() {
  const { user } = useAuth();
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  useEffect(() => {
    // Register service worker for PWA features
    if (process.env.NODE_ENV === 'production') {
      serviceWorker.register({
        onSuccess: (registration) => {
          console.log('Service Worker registered successfully:', registration);
        },
        onUpdate: (registration) => {
          console.log('New content is available; please refresh.');
          // You could show a notification to the user here
        }
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/watchlist" element={
            user ? <WatchlistManager userId={user.id} /> : <LoginForm />
          } />
          <Route path="/recommendations" element={
            user ? <SmartRecommendations userId={user.id} /> : <LoginForm />
          } />
          <Route path="/profile" element={
            user ? <UserProfile /> : <LoginForm />
          } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>

        {/* Theme Customizer Modal */}
        <ThemeCustomizer 
          isOpen={showThemeCustomizer} 
          onClose={() => setShowThemeCustomizer(false)} 
        />

        {/* Global Theme Customizer Trigger */}
        <button 
          className="theme-customizer-trigger"
          onClick={() => setShowThemeCustomizer(true)}
          title="Customize Theme"
        >
          🎨
        </button>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
