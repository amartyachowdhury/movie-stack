import React, { useState, useEffect, useRef } from 'react';
import { Movie } from './MovieCard';
import './MovieTrailers.css';

interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

interface MovieTrailersProps {
  movie: Movie;
  onClose?: () => void;
}

const MovieTrailers: React.FC<MovieTrailersProps> = ({ movie, onClose }) => {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [activeTab, setActiveTab] = useState<'trailers' | 'clips' | 'featurettes'>('trailers');
  const [autoplay, setAutoplay] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchTrailers();
  }, [movie.id]);

  const fetchTrailers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual TMDB API call
      const mockTrailers: Trailer[] = [
        {
          id: '1',
          key: 'YoHD9XEInc0',
          name: 'Official Trailer',
          site: 'YouTube',
          size: 1080,
          type: 'Trailer',
          official: true,
          published_at: '2023-07-20T10:00:00Z'
        },
        {
          id: '2',
          key: '8hP9D6kZseM',
          name: 'Teaser Trailer',
          site: 'YouTube',
          size: 1080,
          type: 'Trailer',
          official: true,
          published_at: '2023-06-15T14:30:00Z'
        },
        {
          id: '3',
          key: 'dQw4w9WgXcQ',
          name: 'Behind the Scenes',
          site: 'YouTube',
          size: 720,
          type: 'Featurette',
          official: false,
          published_at: '2023-08-05T16:45:00Z'
        },
        {
          id: '4',
          key: 'jNQXAC9IVRw',
          name: 'Character Spotlight',
          site: 'YouTube',
          size: 720,
          type: 'Clip',
          official: false,
          published_at: '2023-07-25T12:20:00Z'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setTrailers(mockTrailers);
      
      // Auto-select first trailer
      if (mockTrailers.length > 0) {
        setSelectedTrailer(mockTrailers[0]);
      }
    } catch (error) {
      console.error('Failed to fetch trailers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrailers = trailers.filter(trailer => {
    switch (activeTab) {
      case 'trailers':
        return trailer.type === 'Trailer';
      case 'clips':
        return trailer.type === 'Clip';
      case 'featurettes':
        return trailer.type === 'Featurette';
      default:
        return true;
    }
  });

  const getTrailerUrl = (trailer: Trailer) => {
    const baseUrl = 'https://www.youtube.com/embed/';
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: showControls ? '1' : '0',
      modestbranding: '1',
      rel: '0',
      showinfo: '0',
      iv_load_policy: '3',
      cc_load_policy: '1'
    });
    
    return `${baseUrl}${trailer.key}?${params.toString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getQualityLabel = (size: number) => {
    if (size >= 1080) return 'HD';
    if (size >= 720) return 'HD';
    return 'SD';
  };

  if (loading) {
    return (
      <div className="movie-trailers loading">
        <div className="trailers-skeleton">
          <div className="skeleton-player"></div>
          <div className="skeleton-list">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-item"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-trailers">
      <div className="trailers-header">
        <div className="header-info">
          <h2>🎬 {movie.title} - Videos</h2>
          <p>{trailers.length} videos available</p>
        </div>
        <div className="header-controls">
          <button 
            className={`control-button ${autoplay ? 'active' : ''}`}
            onClick={() => setAutoplay(!autoplay)}
            title="Autoplay"
          >
            ▶️
          </button>
          <button 
            className={`control-button ${showControls ? 'active' : ''}`}
            onClick={() => setShowControls(!showControls)}
            title="Show Controls"
          >
            🎛️
          </button>
          {onClose && (
            <button 
              className="close-button"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="trailers-content">
        <div className="video-player-section">
          {selectedTrailer ? (
            <div className="video-player">
              <iframe
                ref={iframeRef}
                src={getTrailerUrl(selectedTrailer)}
                title={selectedTrailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="video-info">
                <h3>{selectedTrailer.name}</h3>
                <div className="video-meta">
                  <span className="video-type">{selectedTrailer.type}</span>
                  <span className="video-quality">{getQualityLabel(selectedTrailer.size)}</span>
                  <span className="video-date">{formatDate(selectedTrailer.published_at)}</span>
                  {selectedTrailer.official && (
                    <span className="official-badge">Official</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-video-selected">
              <div className="no-video-icon">🎬</div>
              <h3>Select a video to watch</h3>
              <p>Choose from the available trailers, clips, and featurettes</p>
            </div>
          )}
        </div>

        <div className="video-list-section">
          <div className="video-tabs">
            <button 
              className={`video-tab ${activeTab === 'trailers' ? 'active' : ''}`}
              onClick={() => setActiveTab('trailers')}
            >
              Trailers ({trailers.filter(t => t.type === 'Trailer').length})
            </button>
            <button 
              className={`video-tab ${activeTab === 'clips' ? 'active' : ''}`}
              onClick={() => setActiveTab('clips')}
            >
              Clips ({trailers.filter(t => t.type === 'Clip').length})
            </button>
            <button 
              className={`video-tab ${activeTab === 'featurettes' ? 'active' : ''}`}
              onClick={() => setActiveTab('featurettes')}
            >
              Featurettes ({trailers.filter(t => t.type === 'Featurette').length})
            </button>
          </div>

          <div className="video-list">
            {filteredTrailers.length === 0 ? (
              <div className="no-videos">
                <p>No {activeTab} available for this movie.</p>
              </div>
            ) : (
              filteredTrailers.map(trailer => (
                <div 
                  key={trailer.id}
                  className={`video-item ${selectedTrailer?.id === trailer.id ? 'active' : ''}`}
                  onClick={() => setSelectedTrailer(trailer)}
                >
                  <div className="video-thumbnail">
                    <img 
                      src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                      alt={trailer.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-video.jpg';
                      }}
                    />
                    <div className="play-overlay">
                      <span>▶</span>
                    </div>
                    <div className="video-duration">
                      <span>{getQualityLabel(trailer.size)}</span>
                    </div>
                  </div>
                  <div className="video-details">
                    <h4>{trailer.name}</h4>
                    <div className="video-meta-small">
                      <span className="video-type-small">{trailer.type}</span>
                      <span className="video-date-small">{formatDate(trailer.published_at)}</span>
                      {trailer.official && (
                        <span className="official-badge-small">Official</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="trailers-footer">
        <div className="footer-info">
          <p>All videos are embedded from YouTube and respect their terms of service.</p>
        </div>
        <div className="footer-actions">
          <button className="share-button">
            📤 Share
          </button>
          <button className="fullscreen-button">
            ⛶ Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieTrailers;
