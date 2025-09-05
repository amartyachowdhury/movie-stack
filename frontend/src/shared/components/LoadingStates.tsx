import React from 'react';
import './LoadingStates.css';

interface LoadingStatesProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'wave' | 'ripple';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  className?: string;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({
  type = 'spinner',
  size = 'medium',
  color = 'var(--accent-primary)',
  text,
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'loading--small';
      case 'large': return 'loading--large';
      default: return 'loading--medium';
    }
  };

  const renderSpinner = () => (
    <div className={`loading-spinner ${getSizeClass()}`} style={{ borderTopColor: color }}>
      <div className="loading-spinner-inner"></div>
    </div>
  );

  const renderDots = () => (
    <div className={`loading-dots ${getSizeClass()}`}>
      <div className="loading-dot" style={{ backgroundColor: color }}></div>
      <div className="loading-dot" style={{ backgroundColor: color }}></div>
      <div className="loading-dot" style={{ backgroundColor: color }}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`loading-pulse ${getSizeClass()}`} style={{ backgroundColor: color }}></div>
  );

  const renderSkeleton = () => (
    <div className={`loading-skeleton ${getSizeClass()}`}>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
    </div>
  );

  const renderWave = () => (
    <div className={`loading-wave ${getSizeClass()}`}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="wave-bar"></div>
      ))}
    </div>
  );

  const renderRipple = () => (
    <div className={`loading-ripple ${getSizeClass()}`}>
      <div className="ripple-circle"></div>
      <div className="ripple-circle"></div>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots': return renderDots();
      case 'pulse': return renderPulse();
      case 'skeleton': return renderSkeleton();
      case 'wave': return renderWave();
      case 'ripple': return renderRipple();
      default: return renderSpinner();
    }
  };

  return (
    <div className={`loading-container ${className}`}>
      {renderLoader()}
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default LoadingStates;
