import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
  enableBlur?: boolean;
  enableFade?: boolean;
  enableProgressive?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = '/placeholder-movie.svg',
  className = '',
  width,
  height,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  enableBlur = true,
  enableFade = true,
  enableProgressive = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [imageQuality, setImageQuality] = useState<'low' | 'high'>('low');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Micro-interactions for image interactions
  const microInteractions = useMicroInteractions({
    hoverDelay: 0,
    animationDuration: 200,
    enableRipple: false,
    enableHover: true,
    enablePress: true,
    enableFocus: true
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const loadImage = () => {
      // Validate the source URL
      if (!src || src === 'undefined' || src === 'null') {
        console.warn('LazyImage: Invalid source URL:', src);
        setHasError(true);
        onError?.();
        return;
      }

      // Check for malformed TMDB URLs
      if (src.includes('image.tmdb.org') && !src.includes('/t/p/')) {
        console.warn('LazyImage: Malformed TMDB URL detected:', src);
      }

      if (enableProgressive && src.includes('/w500')) {
        // Load low quality first, then high quality
        const lowQualitySrc = src.replace('/w500', '/w200');
        const img = new Image();
        
        img.onload = () => {
          setCurrentSrc(lowQualitySrc);
          setImageQuality('low');
          
          // Load high quality after a short delay
          setTimeout(() => {
            const highQualityImg = new Image();
            highQualityImg.onload = () => {
              setCurrentSrc(src);
              setImageQuality('high');
              setIsLoaded(true);
              onLoad?.();
            };
            highQualityImg.onerror = () => {
              setHasError(true);
              onError?.();
            };
            highQualityImg.src = src;
          }, 100);
        };
        
        img.onerror = () => {
          setHasError(true);
          onError?.();
        };
        
        img.src = lowQualitySrc;
      } else {
        // Load directly
        const img = new Image();
        img.onload = () => {
          setCurrentSrc(src);
          setIsLoaded(true);
          onLoad?.();
        };
        img.onerror = () => {
          setHasError(true);
          onError?.();
        };
        img.src = src;
      }
    };

    loadImage();
  }, [isInView, src, enableProgressive, onLoad, onError]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setHasError(true);
    setCurrentSrc(placeholder);
    onError?.();
  }, [placeholder, onError]);

  // Get CSS classes
  const getImageClasses = () => {
    const classes = ['lazy-image'];
    
    if (className) classes.push(className);
    if (isLoaded) classes.push('lazy-image--loaded');
    if (isInView) classes.push('lazy-image--in-view');
    if (hasError) classes.push('lazy-image--error');
    if (enableBlur && imageQuality === 'low') classes.push('lazy-image--blur');
    if (enableFade && isLoaded) classes.push('lazy-image--fade');
    
    return classes.join(' ');
  };

  // Get image style
  const getImageStyle = () => {
    const style: React.CSSProperties = {};
    
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    
    return style;
  };

  return (
    <div 
      className={`lazy-image-container ${microInteractions.state.isHovered ? 'lazy-image-container--hovered' : ''}`}
      style={getImageStyle()}
      {...microInteractions.handlers}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="lazy-image-placeholder">
          <div className="lazy-image-skeleton"></div>
        </div>
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={getImageClasses()}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        decoding="async"
      />

      {/* Loading Spinner */}
      {isInView && !isLoaded && !hasError && (
        <div className="lazy-image-loading">
          <div className="lazy-image-spinner"></div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="lazy-image-error">
          <span className="lazy-image-error-icon">🖼️</span>
          <span className="lazy-image-error-text">Image not available</span>
        </div>
      )}

      {/* Progressive Loading Indicator */}
      {enableProgressive && isLoaded && imageQuality === 'low' && (
        <div className="lazy-image-progressive">
          <div className="lazy-image-progressive-bar"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
