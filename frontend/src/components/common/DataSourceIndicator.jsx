// Data Source Indicator Component - Shows which API provided the data
import React from 'react';

const DataSourceIndicator = ({ source, size = 'small', showIcon = true }) => {
  const getSourceConfig = (source) => {
    switch (source.toLowerCase()) {
      case 'tmdb':
        return {
          name: 'TMDB',
          fullName: 'The Movie Database',
          color: '#01b4e4',
          icon: '🎬',
          description: 'Community-driven movie database'
        };
      case 'omdb':
        return {
          name: 'OMDb',
          fullName: 'Open Movie Database',
          color: '#f5c518',
          icon: '🎯',
          description: 'Professional movie ratings & metadata'
        };
      case 'combined':
        return {
          name: 'Combined',
          fullName: 'Multiple Sources',
          color: '#e50914',
          icon: '🔗',
          description: 'Data from multiple APIs'
        };
      default:
        return {
          name: source,
          fullName: source,
          color: '#666',
          icon: '📊',
          description: 'External data source'
        };
    }
  };

  const config = getSourceConfig(source);

  if (size === 'large') {
    return (
      <div className="data-source-indicator large" style={{ borderColor: config.color }}>
        <div className="source-icon" style={{ color: config.color }}>
          {showIcon && config.icon}
        </div>
        <div className="source-info">
          <div className="source-name" style={{ color: config.color }}>
            {config.name}
          </div>
          <div className="source-description">
            {config.description}
          </div>
        </div>
      </div>
    );
  }

  return (
    <span 
      className="data-source-indicator small" 
      style={{ 
        backgroundColor: `${config.color}20`,
        borderColor: config.color,
        color: config.color
      }}
      title={`${config.fullName}: ${config.description}`}
    >
      {showIcon && config.icon}
      <span className="source-name">{config.name}</span>
    </span>
  );
};

export default DataSourceIndicator;
