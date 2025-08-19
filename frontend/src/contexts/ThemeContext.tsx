import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'custom';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('movie-stack-theme') as Theme;
    return savedTheme || 'dark';
  });

  const [customColors, setCustomColorsState] = useState<CustomColors>(() => {
    const savedColors = localStorage.getItem('movie-stack-custom-colors');
    return savedColors ? JSON.parse(savedColors) : {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb'
    };
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('movie-stack-theme', newTheme);
  };

  const setCustomColors = (colors: CustomColors) => {
    setCustomColorsState(colors);
    localStorage.setItem('movie-stack-custom-colors', JSON.stringify(colors));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme', 'custom-theme');
    
    // Add new theme class
    root.classList.add(`${theme}-theme`);
    
    // Apply custom colors if using custom theme
    if (theme === 'custom') {
      root.style.setProperty('--custom-primary', customColors.primary);
      root.style.setProperty('--custom-secondary', customColors.secondary);
      root.style.setProperty('--custom-accent', customColors.accent);
      
      // Update CSS variables to use custom colors
      root.style.setProperty('--accent-primary', customColors.primary);
      root.style.setProperty('--accent-secondary', customColors.secondary);
      root.style.setProperty('--accent-tertiary', customColors.accent);
    } else {
      // Reset custom color variables
      root.style.removeProperty('--custom-primary');
      root.style.removeProperty('--custom-secondary');
      root.style.removeProperty('--custom-accent');
    }
  }, [theme, customColors]);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('movie-stack-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeContextType = {
    theme,
    setTheme,
    customColors,
    setCustomColors,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
