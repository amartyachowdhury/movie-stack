import { useState, useCallback, useRef, useEffect } from 'react';

interface MicroInteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isAnimating: boolean;
}

interface UseMicroInteractionsOptions {
  hoverDelay?: number;
  animationDuration?: number;
  enableRipple?: boolean;
  enableHover?: boolean;
  enablePress?: boolean;
  enableFocus?: boolean;
}

export const useMicroInteractions = (options: UseMicroInteractionsOptions = {}) => {
  const {
    hoverDelay = 0,
    animationDuration = 200,
    enableRipple = true,
    enableHover = true,
    enablePress = true,
    enableFocus = true
  } = options;

  const [state, setState] = useState<MicroInteractionState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isAnimating: false
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const rippleRef = useRef<HTMLDivElement>(null);

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    if (!enableHover) return;
    
    if (hoverDelay > 0) {
      hoverTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isHovered: true }));
      }, hoverDelay);
    } else {
      setState(prev => ({ ...prev, isHovered: true }));
    }
  }, [enableHover, hoverDelay]);

  const handleMouseLeave = useCallback(() => {
    if (!enableHover) return;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setState(prev => ({ ...prev, isHovered: false }));
  }, [enableHover]);

  // Press handlers
  const handleMouseDown = useCallback(() => {
    if (!enablePress) return;
    setState(prev => ({ ...prev, isPressed: true }));
  }, [enablePress]);

  const handleMouseUp = useCallback(() => {
    if (!enablePress) return;
    setState(prev => ({ ...prev, isPressed: false }));
  }, [enablePress]);

  // Focus handlers
  const handleFocus = useCallback(() => {
    if (!enableFocus) return;
    setState(prev => ({ ...prev, isFocused: true }));
  }, [enableFocus]);

  const handleBlur = useCallback(() => {
    if (!enableFocus) return;
    setState(prev => ({ ...prev, isFocused: false }));
  }, [enableFocus]);

  // Ripple effect
  const createRipple = useCallback((event: React.MouseEvent) => {
    if (!enableRipple || !rippleRef.current) return;

    const ripple = document.createElement('span');
    const rect = rippleRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple ${animationDuration}ms ease-out;
      pointer-events: none;
    `;

    rippleRef.current.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, animationDuration);
  }, [enableRipple, animationDuration]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback(() => {
    if (!enablePress) return;
    setState(prev => ({ ...prev, isPressed: true }));
  }, [enablePress]);

  const handleTouchEnd = useCallback(() => {
    if (!enablePress) return;
    setState(prev => ({ ...prev, isPressed: false }));
  }, [enablePress]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Animation state management
  const startAnimation = useCallback(() => {
    setState(prev => ({ ...prev, isAnimating: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, animationDuration);
  }, [animationDuration]);

  return {
    state,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onClick: createRipple
    },
    rippleRef,
    startAnimation,
    isActive: state.isHovered || state.isPressed || state.isFocused || state.isAnimating
  };
};
