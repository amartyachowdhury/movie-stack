// Shared components and utilities exports
export * from './components/ui';
export * from './components/navigation';
export { default as LazyImage } from './components/LazyImage';
export { default as LoadingStates } from './components/LoadingStates';
export { default as ErrorBoundary } from './components/ErrorBoundary';
export { default as Toast } from './components/Toast';
export { default as ToastContainer } from './components/ToastContainer';
export { default as AnimatedPage } from './components/AnimatedPage';
export { default as ThemeToggle } from './components/ThemeToggle';
export { default as ThemeCustomizer } from './components/ThemeCustomizer';

// Contexts
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { AnimationProvider, useAnimation } from './AnimationContext';

// Hooks
export { useCache } from './hooks/useCache';
export { useMicroInteractions } from './hooks/useMicroInteractions';
export { usePerformance } from './hooks/usePerformance';
