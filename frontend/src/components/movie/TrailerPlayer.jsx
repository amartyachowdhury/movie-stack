// Trailer Player Component
import React, { useState } from 'react';

const TrailerPlayer = ({ video, onClose, isOpen }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen || !video) return null;

  const getYouTubeEmbedUrl = (videoKey) => {
    return `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsLoading(true);
    onClose();
  };

  return (
    <div className="trailer-overlay">
      <div className="trailer-modal">
        <div className="trailer-header">
          <h3>{video.name}</h3>
          <button 
            className="trailer-close-button"
            onClick={handleClose}
            aria-label="Close trailer"
          >
            ✕
          </button>
        </div>
        
        <div className="trailer-content">
          {isLoading && (
            <div className="trailer-loading">
              <div className="loading-spinner"></div>
              <p>Loading trailer...</p>
            </div>
          )}
          
          <iframe
            src={getYouTubeEmbedUrl(video.key)}
            title={video.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="trailer-iframe"
            onLoad={handleLoad}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        </div>
        
        <div className="trailer-info">
          <p className="trailer-type">{video.type}</p>
          <p className="trailer-duration">{video.size}p</p>
        </div>
      </div>
    </div>
  );
};

export default TrailerPlayer;
