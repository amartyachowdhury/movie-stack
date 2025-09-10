import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import './ThemeCustomizer.css';

interface ColorScheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  preview: string;
}

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, customColors, setCustomColors } = useTheme();
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'advanced'>('presets');
  const [selectedScheme, setSelectedScheme] = useState<string>('');
  const [customPrimary, setCustomPrimary] = useState(customColors.primary);
  const [customSecondary, setCustomSecondary] = useState(customColors.secondary);
  const [customAccent, setCustomAccent] = useState(customColors.accent);
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [borderRadius, setBorderRadius] = useState<'none' | 'small' | 'medium' | 'large'>('medium');
  const [shadowIntensity, setShadowIntensity] = useState<'none' | 'subtle' | 'medium' | 'bold'>('medium');

  const presetSchemes: ColorScheme[] = [
    {
      id: 'ocean',
      name: 'Ocean Blue',
      description: 'Deep blues and teals for a calming experience',
      colors: {
        primary: '#1e40af',
        secondary: '#0ea5e9',
        accent: '#06b6d4',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc'
      },
      preview: '🌊'
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      description: 'Warm oranges and reds for an energetic feel',
      colors: {
        primary: '#dc2626',
        secondary: '#ea580c',
        accent: '#f59e0b',
        background: '#1c1917',
        surface: '#292524',
        text: '#fef2f2'
      },
      preview: '🌅'
    },
    {
      id: 'forest',
      name: 'Forest Green',
      description: 'Natural greens for a peaceful atmosphere',
      colors: {
        primary: '#059669',
        secondary: '#10b981',
        accent: '#34d399',
        background: '#0f1419',
        surface: '#1a1f2e',
        text: '#f0fdf4'
      },
      preview: '🌲'
    },
    {
      id: 'lavender',
      name: 'Lavender Dream',
      description: 'Soft purples for a dreamy experience',
      colors: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        background: '#1a1625',
        surface: '#2d1b69',
        text: '#faf5ff'
      },
      preview: '💜'
    },
    {
      id: 'midnight',
      name: 'Midnight Black',
      description: 'Pure blacks and grays for a sleek look',
      colors: {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#6b7280',
        background: '#000000',
        surface: '#111827',
        text: '#ffffff'
      },
      preview: '🌙'
    },
    {
      id: 'candy',
      name: 'Candy Pink',
      description: 'Bright pinks for a playful vibe',
      colors: {
        primary: '#ec4899',
        secondary: '#f472b6',
        accent: '#f9a8d4',
        background: '#1f1f23',
        surface: '#2d1b3d',
        text: '#fdf2f8'
      },
      preview: '🍬'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const applyPresetScheme = (scheme: ColorScheme) => {
    setCustomColors(scheme.colors);
    setSelectedScheme(scheme.id);
    setTheme('custom');
  };

  const applyCustomColors = () => {
    setCustomColors({
      primary: customPrimary,
      secondary: customSecondary,
      accent: customAccent
    });
    setTheme('custom');
  };

  const applyAdvancedSettings = () => {
    // Apply animation speed
    document.documentElement.style.setProperty('--animation-speed', 
      animationSpeed === 'slow' ? '0.5s' : 
      animationSpeed === 'fast' ? '0.15s' : '0.3s'
    );

    // Apply border radius
    document.documentElement.style.setProperty('--border-radius', 
      borderRadius === 'none' ? '0px' :
      borderRadius === 'small' ? '4px' :
      borderRadius === 'large' ? '16px' : '8px'
    );

    // Apply shadow intensity
    const shadowValues = {
      none: 'none',
      subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
      bold: '0 10px 25px rgba(0, 0, 0, 0.15)'
    };
    document.documentElement.style.setProperty('--shadow-intensity', shadowValues[shadowIntensity]);
  };

  const resetToDefault = () => {
    setCustomColors({
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb'
    });
    setTheme('dark');
    setSelectedScheme('');
    setAnimationSpeed('normal');
    setBorderRadius('medium');
    setShadowIntensity('medium');
  };

  const exportTheme = () => {
    const themeData = {
      colors: customColors,
      animationSpeed,
      borderRadius,
      shadowIntensity,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie-stack-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="theme-customizer-overlay">
      <div className="theme-customizer">
        <div className="customizer-header">
          <h2>🎨 Theme Customizer</h2>
          <p>Personalize your Movie Stack experience</p>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="customizer-tabs">
          <button 
            className={`customizer-tab ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            🎨 Presets
          </button>
          <button 
            className={`customizer-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            🎯 Custom Colors
          </button>
          <button 
            className={`customizer-tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            ⚙️ Advanced
          </button>
        </div>

        <div className="customizer-content">
          {activeTab === 'presets' && (
            <div className="presets-section">
              <div className="schemes-grid">
                {presetSchemes.map(scheme => (
                  <div 
                    key={scheme.id}
                    className={`scheme-card ${selectedScheme === scheme.id ? 'selected' : ''}`}
                    onClick={() => applyPresetScheme(scheme)}
                  >
                    <div 
                      className="scheme-preview" 
                      style={{ backgroundColor: scheme.colors.background }}
                    >
                      <div className="scheme-icon">{scheme.preview}</div>
                      <div className="scheme-colors">
                        <div 
                          className="color-swatch" 
                          style={{ backgroundColor: scheme.colors.primary }}
                        ></div>
                        <div 
                          className="color-swatch" 
                          style={{ backgroundColor: scheme.colors.secondary }}
                        ></div>
                        <div 
                          className="color-swatch" 
                          style={{ backgroundColor: scheme.colors.accent }}
                        ></div>
                      </div>
                    </div>
                    <div className="scheme-info">
                      <h4>{scheme.name}</h4>
                      <p>{scheme.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="custom-section">
              <div className="color-picker-group">
                <label>Primary Color</label>
                <div className="color-picker">
                  <label htmlFor="primary-color-picker" className="sr-only">Primary Color Picker</label>
                  <input
                    id="primary-color-picker"
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                  />
                  <label htmlFor="primary-color-text" className="sr-only">Primary Color Text Input</label>
                  <input
                    id="primary-color-text"
                    type="text"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    placeholder="#667eea"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Secondary Color</label>
                <div className="color-picker">
                  <label htmlFor="secondary-color-picker" className="sr-only">Secondary Color Picker</label>
                  <input
                    id="secondary-color-picker"
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                  />
                  <label htmlFor="secondary-color-text" className="sr-only">Secondary Color Text Input</label>
                  <input
                    id="secondary-color-text"
                    type="text"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    placeholder="#764ba2"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Accent Color</label>
                <div className="color-picker">
                  <label htmlFor="accent-color-picker" className="sr-only">Accent Color Picker</label>
                  <input
                    id="accent-color-picker"
                    type="color"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                  />
                  <label htmlFor="accent-color-text" className="sr-only">Accent Color Text Input</label>
                  <input
                    id="accent-color-text"
                    type="text"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    placeholder="#f093fb"
                  />
                </div>
              </div>

              <div className="color-preview">
                <h4>Preview</h4>
                <div 
                  className="preview-card"
                  style={{
                    '--custom-primary': customPrimary,
                    '--custom-secondary': customSecondary,
                    '--custom-accent': customAccent
                  } as React.CSSProperties}
                >
                  <div className="preview-header">Sample Card</div>
                  <div className="preview-content">
                    <div className="preview-button primary">Primary Button</div>
                    <div className="preview-button secondary">Secondary Button</div>
                    <div className="preview-accent">Accent Element</div>
                  </div>
                </div>
              </div>

              <button className="apply-button" onClick={applyCustomColors}>
                Apply Custom Colors
              </button>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="advanced-section">
              <div className="setting-group">
                <label htmlFor="animation-speed-select">Animation Speed</label>
                <select 
                  id="animation-speed-select"
                  value={animationSpeed} 
                  onChange={(e) => setAnimationSpeed(e.target.value as any)}
                >
                  <option value="slow">Slow (0.5s)</option>
                  <option value="normal">Normal (0.3s)</option>
                  <option value="fast">Fast (0.15s)</option>
                </select>
              </div>

              <div className="setting-group">
                <label htmlFor="border-radius-select">Border Radius</label>
                <select 
                  id="border-radius-select"
                  value={borderRadius} 
                  onChange={(e) => setBorderRadius(e.target.value as any)}
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (4px)</option>
                  <option value="medium">Medium (8px)</option>
                  <option value="large">Large (16px)</option>
                </select>
              </div>

              <div className="setting-group">
                <label htmlFor="shadow-intensity-select">Shadow Intensity</label>
                <select 
                  id="shadow-intensity-select"
                  value={shadowIntensity} 
                  onChange={(e) => setShadowIntensity(e.target.value as any)}
                >
                  <option value="none">None</option>
                  <option value="subtle">Subtle</option>
                  <option value="medium">Medium</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              <button className="apply-button" onClick={applyAdvancedSettings}>
                Apply Advanced Settings
              </button>
            </div>
          )}
        </div>

        <div className="customizer-footer">
          <div className="footer-actions">
            <button className="reset-button" onClick={resetToDefault}>
              🔄 Reset to Default
            </button>
            <button className="export-button" onClick={exportTheme}>
              📤 Export Theme
            </button>
          </div>
          <div className="footer-info">
            <p>Your theme preferences are saved automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
