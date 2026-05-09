// Main App Component - Movie Stack
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import ErrorBoundary from './components/layout/ErrorBoundary';
import './styles/App.css';

// App Router Component
const AppRouter = () => {
  const navigate = useNavigate();

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handlePersonClick = (person) => {
    if (person?.id) {
      navigate(`/person/${person.id}`);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage onMovieClick={handleMovieClick} />
            } 
          />
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetailsWrapper
                onBack={handleBack}
                onMovieClick={handleMovieClick}
                onPersonClick={handlePersonClick}
              />
            }
          />
          <Route
            path="/person/:id"
            element={
              <PersonDetailsWrapper
                onBack={handleBack}
                onMovieClick={handleMovieClick}
              />
            }
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

// Movie Details Wrapper Component
const MovieDetailsWrapper = ({ onBack, onMovieClick, onPersonClick }) => {
  const { id } = useParams();
  return <MovieDetailsPage movieId={id} onBack={onBack} onMovieClick={onMovieClick} onPersonClick={onPersonClick} />;
};

const PersonDetailsWrapper = ({ onBack, onMovieClick }) => {
  const { id } = useParams();
  return <PersonDetailsPage personId={id} onBack={onBack} onMovieClick={onMovieClick} />;
};

// Main App Component
function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;