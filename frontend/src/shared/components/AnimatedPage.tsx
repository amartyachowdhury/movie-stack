import React, { useEffect, useRef } from 'react';
import { useAnimation } from '../contexts/AnimationContext';
import './AnimatedPage.css';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
  animationDelay?: number;
  onAnimationComplete?: () => void;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  className = '',
  animationDelay = 0,
  onAnimationComplete
}) => {
  const { animationState } = useAnimation();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const handleAnimationEnd = () => {
      onAnimationComplete?.();
    };

    page.addEventListener('animationend', handleAnimationEnd);
    return () => page.removeEventListener('animationend', handleAnimationEnd);
  }, [onAnimationComplete]);

  const getAnimationClass = () => {
    const { isTransitioning, direction, animationType } = animationState;
    
    if (!isTransitioning) {
      return 'animated-page--visible';
    }

    switch (animationType) {
      case 'slide':
        return direction === 'forward' 
          ? 'animated-page--slide-in-forward' 
          : 'animated-page--slide-in-backward';
      case 'scale':
        return 'animated-page--scale-in';
      case 'flip':
        return 'animated-page--flip-in';
      case 'fade':
      default:
        return 'animated-page--fade-in';
    }
  };

  return (
    <div
      ref={pageRef}
      className={`animated-page ${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedPage;
