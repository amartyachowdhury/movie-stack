import React, { useState, useEffect } from 'react';
import MovieCard from '../../movies/components/MovieCard';
import { Movie } from '../../../shared/types';
import './WatchlistManager.css';

interface WatchlistItem {
  id: number;
  movie: Movie;
  addedAt: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  watched: boolean;
  watchedAt?: string;
}

interface WatchlistManagerProps {
  userId: number;
  onMovieClick?: (movie: Movie) => void;
}

const WatchlistManager: React.FC<WatchlistManagerProps> = ({ userId, onMovieClick }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unwatched' | 'watched' | 'high-priority'>('all');
  const [sortBy, setSortBy] = useState<'added' | 'title' | 'priority' | 'rating'>('added');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<WatchlistItem | null>(null);

  useEffect(() => {
    fetchWatchlist();
  }, [userId]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockWatchlist: WatchlistItem[] = [
        {
          id: 1,
          movie: {
            id: 1,
            title: 'Oppenheimer',
            overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
            poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
            vote_average: 8.1,
            vote_count: 5000,
            release_date: '2023-07-21',
            genre_ids: [18, 36],
            adult: false,
            original_language: 'en',
            original_title: 'Oppenheimer',
            popularity: 95.2,
            video: false
          },
          addedAt: '2024-01-15T10:30:00Z',
          priority: 'high',
          watched: false,
          notes: 'Must watch - Christopher Nolan film'
        },
        {
          id: 2,
          movie: {
            id: 2,
            title: 'Poor Things',
            overview: 'The incredible tale about the fantastical evolution of Bella Baxter.',
            poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
            vote_average: 7.8,
            vote_count: 3000,
            release_date: '2023-12-08',
            genre_ids: [35, 18, 14],
            adult: false,
            original_language: 'en',
            original_title: 'Poor Things',
            popularity: 78.5,
            video: false
          },
          addedAt: '2024-01-10T14:20:00Z',
          priority: 'medium',
          watched: true,
          watchedAt: '2024-01-20T19:00:00Z',
          notes: 'Excellent performance by Emma Stone'
        },
        {
          id: 3,
          movie: {
            id: 3,
            title: 'Dune: Part Two',
            overview: 'Paul Atreides unites with Chani and the Fremen.',
            poster_path: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
            vote_average: 8.4,
            vote_count: 4000,
            release_date: '2024-03-01',
            genre_ids: [878, 18, 12],
            adult: false,
            original_language: 'en',
            original_title: 'Dune: Part Two',
            popularity: 96.8,
            video: false
          },
          addedAt: '2024-01-05T09:15:00Z',
          priority: 'high',
          watched: false
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setWatchlist(mockWatchlist);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie: Movie, priority: 'high' | 'medium' | 'low' = 'medium', notes?: string) => {
    const newItem: WatchlistItem = {
      id: Date.now(),
      movie,
      addedAt: new Date().toISOString(),
      priority,
      watched: false,
      notes
    };

    setWatchlist(prev => [newItem, ...prev]);
    setShowAddMovie(false);
  };

  const removeFromWatchlist = async (itemId: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };

  const markAsWatched = async (itemId: number) => {
    setWatchlist(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, watched: true, watchedAt: new Date().toISOString() }
        : item
    ));
  };

  const updatePriority = async (itemId: number, priority: 'high' | 'medium' | 'low') => {
    setWatchlist(prev => prev.map(item => 
      item.id === itemId ? { ...item, priority } : item
    ));
  };

  const updateNotes = async (itemId: number, notes: string) => {
    setWatchlist(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const filteredWatchlist = watchlist.filter(item => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'unwatched' && !item.watched) ||
      (activeTab === 'watched' && item.watched) ||
      (activeTab === 'high-priority' && item.priority === 'high');

    const matchesSearch = 
      !searchQuery ||
      item.movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.movie.title.localeCompare(b.movie.title);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'rating':
        return (b.movie.vote_average || 0) - (a.movie.vote_average || 0);
      case 'added':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLevel = (priority: string) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'low';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'No Priority';
    }
  };

  if (loading) {
    return (
      <div className="watchlist-manager loading">
        <div className="watchlist-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-filters"></div>
          <div className="skeleton-items">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-item"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-manager">
      <div className="watchlist-header">
        <div className="header-info">
          <h2>My Watchlist</h2>
          <p>{watchlist?.length || 0} movies • {watchlist?.filter(item => !item.watched).length || 0} unwatched</p>
        </div>
        <button 
          className="add-movie-button"
          onClick={() => setShowAddMovie(true)}
        >
          <span>+</span>
          Add Movie
        </button>
      </div>

      <div className="watchlist-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({watchlist?.length || 0})
          </button>
          <button 
            className={`filter-tab ${activeTab === 'unwatched' ? 'active' : ''}`}
            onClick={() => setActiveTab('unwatched')}
          >
            Unwatched ({watchlist?.filter(item => !item.watched).length || 0})
          </button>
          <button 
            className={`filter-tab ${activeTab === 'watched' ? 'active' : ''}`}
            onClick={() => setActiveTab('watched')}
          >
            Watched ({watchlist?.filter(item => item.watched).length || 0})
          </button>
          <button 
            className={`filter-tab ${activeTab === 'high-priority' ? 'active' : ''}`}
            onClick={() => setActiveTab('high-priority')}
          >
            High Priority ({watchlist?.filter(item => item.priority === 'high').length || 0})
          </button>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <label htmlFor="sort-select" className="sr-only">Sort Watchlist</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="added">Sort by Added Date</option>
            <option value="title">Sort by Title</option>
            <option value="priority">Sort by Priority</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      <div className="watchlist-content">
        {(!sortedWatchlist || sortedWatchlist.length === 0) ? (
          <div className="empty-watchlist">
            <div className="empty-icon">🎬</div>
            <h3>Your watchlist is empty</h3>
            <p>Start adding movies you want to watch!</p>
            <button 
              className="add-first-movie"
              onClick={() => setShowAddMovie(true)}
            >
              Add Your First Movie
            </button>
          </div>
        ) : (
          <div className="watchlist-grid">
            {sortedWatchlist.map(item => (
              <div key={item.id} className="watchlist-item">
                <div className="item-header">
                  <div className={`priority-badge priority-badge--${getPriorityLevel(item.priority)}`}>
                    {getPriorityLabel(item.priority)}
                  </div>
                  <div className="item-actions">
                    <button 
                      className="action-button"
                      onClick={() => setSelectedMovie(item)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => removeFromWatchlist(item.id)}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <MovieCard
                  movie={item.movie}
                  onMovieClick={onMovieClick}
                />

                <div className="item-details">
                  <div className="item-meta">
                    <span className="added-date">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                    {item.watched && (
                      <span className="watched-date">
                        Watched {new Date(item.watchedAt!).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <div className="item-notes">
                      <p>{item.notes}</p>
                    </div>
                  )}

                  <div className="item-actions-bottom">
                    {!item.watched ? (
                      <button 
                        className="mark-watched-button"
                        onClick={() => markAsWatched(item.id)}
                      >
                        Mark as Watched
                      </button>
                    ) : (
                      <button 
                        className="mark-unwatched-button"
                        onClick={() => setWatchlist(prev => prev.map(w => 
                          w.id === item.id ? { ...w, watched: false, watchedAt: undefined } : w
                        ))}
                      >
                        Mark as Unwatched
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddMovie && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Movie to Watchlist</h3>
            <p>Search and add movies to your watchlist</p>
            {/* Add movie search component here */}
            <div className="modal-actions">
              <button onClick={() => setShowAddMovie(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Watchlist Item</h3>
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="priority-select">Priority</label>
                <select 
                  id="priority-select"
                  value={selectedMovie.priority}
                  onChange={(e) => updatePriority(selectedMovie.id, e.target.value as any)}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={selectedMovie.notes || ''}
                  onChange={(e) => updateNotes(selectedMovie.id, e.target.value)}
                  placeholder="Add your notes about this movie..."
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedMovie(null)}>Save</button>
              <button onClick={() => setSelectedMovie(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistManager;
