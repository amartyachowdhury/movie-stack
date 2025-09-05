import React from 'react';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  className = '',
  onClick,
  href,
  target,
  rel,
  ...props
}) => {
  const baseClasses = 'card';
  const variantClasses = `card--${variant}`;
  const sizeClasses = `card--${size}`;
  const paddingClasses = `card--padding-${padding}`;
  const interactiveClasses = (onClick || href) ? 'card--interactive' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    paddingClasses,
    interactiveClasses,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // If href is provided, render as anchor
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        {...props}
      >
        {children}
      </a>
    );
  }

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <div
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Clickable card"
        {...props}
      >
        {children}
      </div>
    );
  }

  // Default render as div
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;