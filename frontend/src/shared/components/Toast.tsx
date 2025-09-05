import React, { useState, useEffect, useRef } from 'react';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import './Toast.css';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<HTMLDivElement>(null);

  // Micro-interactions for toast interactions
  const microInteractions = useMicroInteractions({
    hoverDelay: 0,
    animationDuration: 200,
    enableRipple: false,
    enableHover: true,
    enablePress: true,
    enableFocus: true
  });

  // Show toast on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration]);

  // Progress bar animation
  useEffect(() => {
    if (progressRef.current && duration > 0) {
      const progress = progressRef.current;
      progress.style.transition = `width ${duration}ms linear`;
      setTimeout(() => {
        progress.style.width = '0%';
      }, 100);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const handleAction = () => {
    action?.onClick();
    handleClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTypeClass = () => {
    return `toast--${type}`;
  };

  return (
    <div
      className={`toast ${getTypeClass()} ${isVisible ? 'toast--visible' : ''} ${isExiting ? 'toast--exiting' : ''}`}
      {...microInteractions.handlers}
      ref={microInteractions.rippleRef as unknown as React.RefObject<HTMLDivElement>}
    >
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="toast-progress">
          <div ref={progressRef} className="toast-progress-bar"></div>
        </div>
      )}

      {/* Toast Content */}
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        
        <div className="toast-body">
          <h4 className="toast-title">{title}</h4>
          {message && (
            <p className="toast-message">{message}</p>
          )}
        </div>

        {/* Action Button */}
        {action && (
          <button
            className="toast-action"
            onClick={handleAction}
            type="button"
          >
            {action.label}
          </button>
        )}

        {/* Close Button */}
        <button
          className="toast-close"
          onClick={handleClose}
          type="button"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
