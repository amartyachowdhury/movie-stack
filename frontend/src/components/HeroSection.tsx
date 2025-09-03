import React from 'react';
import { Button, Card } from './ui';
import './HeroSection.css';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
  };
  backgroundImage?: string;
  overlay?: boolean;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Discover Amazing Movies",
  subtitle = "Your Ultimate Movie Experience",
  description = "Explore thousands of movies, get personalized recommendations, and build your perfect watchlist. From blockbusters to hidden gems, find your next favorite film.",
  primaryAction,
  secondaryAction,
  backgroundImage,
  overlay = true,
  className = ''
}) => {
  const baseClasses = 'hero-section';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <section className={classes}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="hero-section__background">
          <img 
            src={backgroundImage} 
            alt="Hero background" 
            className="hero-section__background-image"
          />
          {overlay && <div className="hero-section__overlay" />}
        </div>
      )}

      {/* Content Container */}
      <div className="hero-section__container">
        <div className="hero-section__content">
          {/* Main Content */}
          <div className="hero-section__main">
            <div className="hero-section__text">
              {subtitle && (
                <p className="hero-section__subtitle">
                  {subtitle}
                </p>
              )}
              
              <h1 className="hero-section__title">
                {title}
              </h1>
              
              {description && (
                <p className="hero-section__description">
                  {description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <div className="hero-section__actions">
                {primaryAction && (
                  <Button
                    variant={primaryAction.variant || 'primary'}
                    size={primaryAction.size || 'lg'}
                    onClick={primaryAction.onClick}
                    className="hero-section__action hero-section__action--primary"
                  >
                    {primaryAction.label}
                  </Button>
                )}
                
                {secondaryAction && (
                  <Button
                    variant={secondaryAction.variant || 'outline'}
                    size={secondaryAction.size || 'lg'}
                    onClick={secondaryAction.onClick}
                    className="hero-section__action hero-section__action--secondary"
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="hero-section__features">
            <Card variant="elevated" size="sm" className="hero-section__feature">
              <div className="hero-section__feature-content">
                <div className="hero-section__feature-icon">🎬</div>
                <h3 className="hero-section__feature-title">Smart Recommendations</h3>
                <p className="hero-section__feature-description">
                  AI-powered suggestions based on your taste
                </p>
              </div>
            </Card>

            <Card variant="elevated" size="sm" className="hero-section__feature">
              <div className="hero-section__feature-content">
                <div className="hero-section__feature-icon">📱</div>
                <h3 className="hero-section__feature-title">Cross-Platform</h3>
                <p className="hero-section__feature-description">
                  Access your watchlist anywhere, anytime
                </p>
              </div>
            </Card>

            <Card variant="elevated" size="sm" className="hero-section__feature">
              <div className="hero-section__feature-content">
                <div className="hero-section__feature-icon">⭐</div>
                <h3 className="hero-section__feature-title">Personalized Experience</h3>
                <p className="hero-section__feature-description">
                  Track ratings and discover new favorites
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="hero-section__decoration">
        <div className="hero-section__decoration-circle hero-section__decoration-circle--1"></div>
        <div className="hero-section__decoration-circle hero-section__decoration-circle--2"></div>
        <div className="hero-section__decoration-circle hero-section__decoration-circle--3"></div>
      </div>
    </section>
  );
};

export default HeroSection;
