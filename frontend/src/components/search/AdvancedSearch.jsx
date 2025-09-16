// Advanced Search Component
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdvancedSearch = ({ onSearch, onClose, isOpen }) => {
  const [filters, setFilters] = useState({
    query: '',
    genre: '',
    year: '',
    minRating: '',
    maxRating: '',
    language: '',
    sortBy: 'popularity.desc'
  });
  
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadGenres();
    }
  }, [isOpen]);

  const loadGenres = async () => {
    try {
      const response = await api.getGenres();
      if (response.success) {
        setGenres(response.data);
      }
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Filter out empty values
      const searchParams = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      await onSearch(searchParams);
      onClose();
    } catch (error) {
      console.error('Advanced search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      query: '',
      genre: '',
      year: '',
      minRating: '',
      maxRating: '',
      language: '',
      sortBy: 'popularity.desc'
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  if (!isOpen) return null;

  return (
    <div className="advanced-search-overlay">
      <div className="advanced-search-modal">
        <div className="advanced-search-header">
          <h2>🔍 Advanced Search</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close advanced search"
          >
            ✕
          </button>
        </div>

        <form className="advanced-search-form" onSubmit={handleSubmit}>
          <div className="search-filters">
            {/* Text Search */}
            <div className="filter-group">
              <label htmlFor="query">Movie Title</label>
              <input
                type="text"
                id="query"
                placeholder="Search for movies..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Genre Filter */}
            <div className="filter-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="filter-group">
              <label htmlFor="year">Release Year</label>
              <select
                id="year"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="filter-select"
              >
                <option value="">Any Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Range */}
            <div className="filter-group">
              <label>Rating Range</label>
              <div className="rating-range">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="filter-input rating-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.maxRating}
                  onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                  className="filter-input rating-input"
                />
              </div>
            </div>

            {/* Language Filter */}
            <div className="filter-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="filter-select"
              >
                <option value="">Any Language</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label htmlFor="sortBy">Sort By</label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Newest First</option>
                <option value="release_date.asc">Oldest First</option>
                <option value="title.asc">Title A-Z</option>
                <option value="title.desc">Title Z-A</option>
              </select>
            </div>
          </div>

          <div className="search-actions">
            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
            >
              Reset Filters
            </button>
            <button
              type="submit"
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Movies'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedSearch;
