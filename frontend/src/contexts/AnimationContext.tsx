import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AnimationState {
  isTransitioning: boolean;
  currentRoute: string;
  direction: 'forward' | 'backward';
  animationType: 'fade' | 'slide' | 'scale' | 'flip';
}

interface AnimationContextType {
  animationState: AnimationState;
  startTransition: (route: string, direction?: 'forward' | 'backward', type?: 'fade' | 'slide' | 'scale' | 'flip') => void;
  endTransition: () => void;
  setAnimationType: (type: 'fade' | 'slide' | 'scale' | 'flip') => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isTransitioning: false,
    currentRoute: '/',
    direction: 'forward',
    animationType: 'fade'
  });

  const startTransition = useCallback((
    route: string, 
    direction: 'forward' | 'backward' = 'forward',
    type: 'fade' | 'slide' | 'scale' | 'flip' = 'fade'
  ) => {
    setAnimationState(prev => ({
      ...prev,
      isTransitioning: true,
      currentRoute: route,
      direction,
      animationType: type
    }));
  }, []);

  const endTransition = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      isTransitioning: false
    }));
  }, []);

  const setAnimationType = useCallback((type: 'fade' | 'slide' | 'scale' | 'flip') => {
    setAnimationState(prev => ({
      ...prev,
      animationType: type
    }));
  }, []);

  const value: AnimationContextType = {
    animationState,
    startTransition,
    endTransition,
    setAnimationType
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};
