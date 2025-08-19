import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SearchBar.css';

interface SearchFilters {
  genre: string;
  year: string;
  minRating: string;
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    genre: '',
    year: '',
    minRating: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(searchQuery, searchFilters);
    }, 500);
  }, [onSearch]);

  useEffect(() => {
    debouncedSearch(query, filters);
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, filters, debouncedSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      minRating: ''
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={handleQueryChange}
            className="search-input"
            disabled={loading}
          />
          {loading && <div className="search-spinner"></div>}
        </div>
        
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
          disabled={loading}
        >
          <span>Filters</span>
          <span className={`filter-arrow ${showFilters ? 'open' : ''}`}>▼</span>
        </button>
      </div>

      {showFilters && (
        <div className="search-filters">
          <div className="filter-group">
            <label>Genre:</label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              disabled={loading}
            >
              <option value="">All Genres</option>
              <option value="action">Action</option>
              <option value="adventure">Adventure</option>
              <option value="animation">Animation</option>
              <option value="comedy">Comedy</option>
              <option value="crime">Crime</option>
              <option value="documentary">Documentary</option>
              <option value="drama">Drama</option>
              <option value="family">Family</option>
              <option value="fantasy">Fantasy</option>
              <option value="history">History</option>
              <option value="horror">Horror</option>
              <option value="music">Music</option>
              <option value="mystery">Mystery</option>
              <option value="romance">Romance</option>
              <option value="science-fiction">Science Fiction</option>
              <option value="thriller">Thriller</option>
              <option value="war">War</option>
              <option value="western">Western</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Year:</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              disabled={loading}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Rating:</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              disabled={loading}
            >
              <option value="">Any Rating</option>
              <option value="9">9+ Stars</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
          </div>

          <button
            className="clear-filters"
            onClick={clearFilters}
            disabled={loading}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
