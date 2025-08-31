import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import './MovieTrailer.css';

interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
}

interface MovieTrailerProps {
  movieId: number;
  movieTitle: string;
  isOpen: boolean;
  onClose: () => void;
  trailers?: Trailer[];
}

const MovieTrailer: React.FC<MovieTrailerProps> = ({
  movieId,
  movieTitle,
  isOpen,
  onClose,
  trailers = []
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Micro-interactions for controls
  const getMicroInteractions = (elementId: string) => {
    return useMicroInteractions({
      hoverDelay: 0,
      animationDuration: 200,
      enableRipple: true,
      enableHover: true,
      enablePress: true,
      enableFocus: true
    });
  };

  // Load trailers if not provided
  useEffect(() => {
    if (isOpen && trailers.length === 0) {
      loadTrailers();
    }
  }, [isOpen, movieId, trailers.length]);

  // Auto-select first trailer when trailers load
  useEffect(() => {
    if (trailers.length > 0 && !selectedTrailer) {
      const officialTrailer = trailers.find(t => t.official) || trailers[0];
      setSelectedTrailer(officialTrailer);
    }
  }, [trailers, selectedTrailer]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  // Load trailers from API
  const loadTrailers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/${movieId}/trailers`);
      if (response.ok) {
        const data = await response.json();
        // Mock data for now - replace with actual API response
        const mockTrailers: Trailer[] = [
          {
            id: '1',
            key: 'dQw4w9WgXcQ', // Rick Roll for demo
            name: 'Official Trailer',
            site: 'YouTube',
            size: 1080,
            type: 'Trailer',
            official: true
          },
          {
            id: '2',
            key: 'jNQXAC9IVRw', // Me at the zoo for demo
            name: 'Teaser Trailer',
            site: 'YouTube',
            size: 720,
            type: 'Trailer',
            official: false
          }
        ];
        // setTrailers(data.trailers);
      }
    } catch (error) {
      console.error('Error loading trailers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle trailer selection
  const handleTrailerSelect = (trailer: Trailer) => {
    setSelectedTrailer(trailer);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (selectedTrailer) {
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Handle mouse movement for controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  // Handle close
  const handleClose = useCallback(() => {
    setIsPlaying(false);
    setSelectedTrailer(null);
    setCurrentTime(0);
    setShowControls(true);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="movie-trailer-overlay"
      onClick={handleClose}
    >
      <div 
        ref={containerRef}
        className="movie-trailer-container"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
      >
        {/* Close Button */}
        <button
          className="movie-trailer-close"
          onClick={handleClose}
          aria-label="Close trailer"
          {...getMicroInteractions('close').handlers}
          ref={getMicroInteractions('close').rippleRef as unknown as React.RefObject<HTMLButtonElement>}
        >
          ✕
        </button>

        {/* Video Player */}
        <div className="movie-trailer-player">
          {selectedTrailer ? (
            <div className="movie-trailer-video-container">
              <iframe
                ref={videoRef}
                src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&rel=0&modestbranding=1`}
                title={`${movieTitle} - ${selectedTrailer.name}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="movie-trailer-video"
              />
              
              {/* Custom Controls Overlay */}
              {showControls && (
                <div className="movie-trailer-controls">
                  <div className="movie-trailer-controls-top">
                    <h3 className="movie-trailer-title">{movieTitle}</h3>
                    <span className="movie-trailer-name">{selectedTrailer.name}</span>
                  </div>
                  
                  <div className="movie-trailer-controls-center">
                    <button
                      className="movie-trailer-play-pause"
                      onClick={handlePlayPause}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      {...getMicroInteractions('play').handlers}
                      ref={getMicroInteractions('play').rippleRef as unknown as React.RefObject<HTMLButtonElement>}
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                  </div>
                  
                  <div className="movie-trailer-controls-bottom">
                    <div className="movie-trailer-progress">
                      <div 
                        className="movie-trailer-progress-bar"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    
                    <div className="movie-trailer-controls-right">
                      <button
                        className="movie-trailer-volume"
                        onClick={handleMuteToggle}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        {...getMicroInteractions('volume').handlers}
                        ref={getMicroInteractions('volume').rippleRef as unknown as React.RefObject<HTMLButtonElement>}
                      >
                        {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                      </button>
                      
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="movie-trailer-volume-slider"
                      />
                      
                      <button
                        className="movie-trailer-fullscreen"
                        onClick={handleFullscreenToggle}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        {...getMicroInteractions('fullscreen').handlers}
                        ref={getMicroInteractions('fullscreen').rippleRef as unknown as React.RefObject<HTMLButtonElement>}
                      >
                        {isFullscreen ? '⤓' : '⤢'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="movie-trailer-loading">
              <div className="movie-trailer-loading-spinner"></div>
              <p>Loading trailers...</p>
            </div>
          )}
        </div>

        {/* Trailer Selection */}
        {trailers.length > 1 && (
          <div className="movie-trailer-selection">
            <h4 className="movie-trailer-selection-title">Available Trailers</h4>
            <div className="movie-trailer-list">
              {trailers.map((trailer) => (
                <button
                  key={trailer.id}
                  className={`movie-trailer-item ${selectedTrailer?.id === trailer.id ? 'movie-trailer-item--active' : ''}`}
                  onClick={() => handleTrailerSelect(trailer)}
                  {...getMicroInteractions(`trailer-${trailer.id}`).handlers}
                  ref={getMicroInteractions(`trailer-${trailer.id}`).rippleRef as unknown as React.RefObject<HTMLButtonElement>}
                >
                  <div className="movie-trailer-item-icon">🎬</div>
                  <div className="movie-trailer-item-info">
                    <span className="movie-trailer-item-name">{trailer.name}</span>
                    <span className="movie-trailer-item-type">{trailer.type}</span>
                    {trailer.official && (
                      <span className="movie-trailer-item-badge">Official</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieTrailer;
