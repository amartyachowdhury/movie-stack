// Header Component
import React, { useState } from 'react';

const Header = ({ onSearch, searchQuery, setSearchQuery, isSearching, onAdvancedSearch }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    onSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    onSearch('');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>🎬 Movie Stack</h1>
          <p>Discover amazing movies powered by TMDB</p>
        </div>
        
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search for movies..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="search-input"
            />
            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="clear-button"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button 
              type="submit" 
              className="search-button"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={onAdvancedSearch}
              className="advanced-search-button"
              title="Advanced Search"
            >
              ⚙️
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
