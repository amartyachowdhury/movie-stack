import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import './SmartSearch.css';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'movie' | 'genre' | 'actor' | 'director';
  year?: number;
  poster?: string;
}

interface SmartSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearch,
  placeholder = "Search movies, genres, actors...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const microInteractions = useMicroInteractions();

  // Load recent and popular searches from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const popular = JSON.parse(localStorage.getItem('popularSearches') || '[]');
    setRecentSearches(recent);
    setPopularSearches(popular);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Mock suggestions - replace with actual API call
        const mockSuggestions: SearchSuggestion[] = [
          {
            id: '1',
            title: `${searchQuery} Movie`,
            type: 'movie',
            year: 2023,
            poster: '/placeholder-movie.svg'
          },
          {
            id: '2',
            title: `${searchQuery} Genre`,
            type: 'genre'
          }
        ];
        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      
      // Call parent search function
      onSearch(searchQuery);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.title);
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on active filter
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (activeFilter === 'all') return true;
    return suggestion.type === activeFilter;
  });

  return (
    <div className={`smart-search ${className}`} ref={suggestionsRef}>
      <div className="smart-search-input-container">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="smart-search-input"
          {...microInteractions.handlers}
          onFocus={() => setShowSuggestions(true)}
        />
        <button
          className="smart-search-button"
          disabled={!query.trim()}
          {...microInteractions.handlers}
          onClick={() => handleSearch()}
        >
          🔍
        </button>
        {isLoading && <div className="smart-search-loading">⏳</div>}
      </div>

      {showSuggestions && (
        <div className="smart-search-suggestions">
          {/* Filter Tabs */}
          <div className="smart-search-filters">
            {['all', 'movie', 'genre', 'actor', 'director'].map(filter => (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="suggestions-section">
              <h4 className="suggestions-title">Suggestions</h4>
              {filteredSuggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-icon">
                    {suggestion.type === 'movie' && '🎬'}
                    {suggestion.type === 'genre' && '🏷️'}
                    {suggestion.type === 'actor' && '👤'}
                    {suggestion.type === 'director' && '🎭'}
                  </div>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{suggestion.title}</div>
                    {suggestion.year && (
                      <div className="suggestion-year">{suggestion.year}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="suggestions-section">
              <h4 className="suggestions-title">Recent Searches</h4>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="suggestion-item recent-search"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <div className="suggestion-icon">🕒</div>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{search}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <div className="suggestions-section">
              <h4 className="suggestions-title">Popular Searches</h4>
              {popularSearches.map((search, index) => (
                <div
                  key={index}
                  className="suggestion-item popular-search"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <div className="suggestion-icon">🔥</div>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{search}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.length >= 2 && filteredSuggestions.length === 0 && !isLoading && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">No results found for "{query}"</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SmartSearch;