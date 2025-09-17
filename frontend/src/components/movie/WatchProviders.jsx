// Watch Providers Component - Displays streaming availability
import React from 'react';

const WatchProviders = ({ watchProviders }) => {
  if (!watchProviders || !watchProviders.results) {
    return null;
  }

  // Get US providers (you can make this dynamic based on user location)
  const usProviders = watchProviders.results.US;
  if (!usProviders) {
    return null;
  }

  // Platform configurations with colors and display names
  const platformConfig = {
    8: { name: 'Netflix', color: '#E50914', icon: '🎬' },
    9: { name: 'Amazon Prime Video', color: '#00A8E1', icon: '📦' },
    15: { name: 'Hulu', color: '#1CE783', icon: '📺' },
    337: { name: 'Disney+', color: '#113CCF', icon: '🏰' },
    384: { name: 'HBO Max', color: '#8B5CF6', icon: '🎭' },
    531: { name: 'Paramount+', color: '#0064FF', icon: '⭐' },
    2: { name: 'Apple TV', color: '#000000', icon: '🍎' },
    3: { name: 'Google Play Movies', color: '#4285F4', icon: '▶️' },
    68: { name: 'Microsoft Store', color: '#00BCF2', icon: '🪟' },
    192: { name: 'YouTube', color: '#FF0000', icon: '📺' },
    7: { name: 'Vudu', color: '#0071F2', icon: '💿' },
    11: { name: 'MUBI', color: '#E4007C', icon: '🎨' },
    387: { name: 'Peacock', color: '#00A4E4', icon: '🦚' },
    350: { name: 'Apple TV+', color: '#000000', icon: '🍎' },
    386: { name: 'Peacock Premium', color: '#00A4E4', icon: '🦚' }
  };

  const getProviderConfig = (providerId) => {
    return platformConfig[providerId] || { 
      name: 'Unknown Platform', 
      color: '#666666', 
      icon: '📺' 
    };
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Stream': return '#4ade80'; // Green for streaming
      case 'Free': return '#fbbf24'; // Yellow for free
      case 'Rent': return '#3b82f6'; // Blue for rent
      case 'Buy': return '#ef4444'; // Red for buy
      default: return '#e50914';
    }
  };

  const renderProviderList = (providers, type, title) => {
    if (!providers || providers.length === 0) return null;

    const typeColor = getTypeColor(type);

    return (
      <div className="provider-category">
        <h4 
          className="provider-category-title"
          style={{ borderLeftColor: typeColor }}
        >
          {title}
        </h4>
        <div className="provider-list">
          {providers.map((provider) => {
            const config = getProviderConfig(provider.provider_id);
            return (
              <a 
                key={provider.provider_id} 
                href={usProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="provider-item"
                style={{ borderColor: config.color }}
                title={`View on ${config.name} via TMDB`}
              >
                <div className="provider-icon" style={{ color: config.color }}>
                  {config.icon}
                </div>
                <div className="provider-info">
                  <div className="provider-name" style={{ color: config.color }}>
                    {config.name}
                  </div>
                  <div className="provider-type" style={{ color: typeColor }}>
                    {type}
                  </div>
                </div>
                {provider.logo_path && (
                  <div className="provider-logo">
                    <img 
                      src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                      alt={config.name}
                      className="provider-logo-image"
                    />
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="watch-providers">
      <h3>📺 Where to Watch</h3>
      <div className="watch-providers-content">
        {renderProviderList(usProviders.flatrate, 'Stream', 'Stream with Subscription')}
        {renderProviderList(usProviders.free, 'Free', 'Free to Watch')}
        {renderProviderList(usProviders.rent, 'Rent', 'Rent')}
        {renderProviderList(usProviders.buy, 'Buy', 'Buy')}
      </div>
    </div>
  );
};

export default WatchProviders;
