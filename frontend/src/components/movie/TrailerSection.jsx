// Trailer Section Component
import React, { useState } from 'react';
import TrailerPlayer from './TrailerPlayer';

const TrailerSection = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  if (!videos || (!videos.trailers?.length && !videos.teasers?.length && !videos.clips?.length)) {
    return null;
  }

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  const renderVideoList = (videoList, title, icon) => {
    if (!videoList || videoList.length === 0) return null;

    return (
      <div className="video-category">
        <h4 className="video-category-title">
          <span className="video-icon">{icon}</span>
          {title} ({videoList.length})
        </h4>
        <div className="video-list">
          {videoList.map((video, index) => (
            <div
              key={`${video.key}-${index}`}
              className="video-item"
              onClick={() => handleVideoClick(video)}
            >
              <div className="video-thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                  alt={video.name}
                  className="video-thumbnail-image"
                />
                <div className="video-play-overlay">
                  <div className="play-button">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="video-details">
                <h5 className="video-title">{video.name}</h5>
                <p className="video-meta">
                  {video.type} • {video.size}p • {video.published_at ? new Date(video.published_at).getFullYear() : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="trailer-section">
      <div className="section-header">
        <h3>🎬 Trailers & Videos</h3>
        <p>Watch official trailers, teasers, and clips</p>
      </div>

      <div className="video-categories">
        {renderVideoList(videos.trailers, 'Official Trailers', '🎬')}
        {renderVideoList(videos.teasers, 'Teasers', '🎭')}
        {renderVideoList(videos.clips, 'Clips', '🎥')}
      </div>

      <TrailerPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </div>
  );
};

export default TrailerSection;
