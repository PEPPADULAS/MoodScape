'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Cloud, 
  CloudRain, 
  Palette, 
  Settings, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Eye,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

// Types for time-based themes
interface TimeBasedTheme {
  id: string;
  name: string;
  timeRange: [number, number]; // [start hour, end hour]
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  icon: React.ReactNode;
  description: string;
}

interface CustomGradient {
  id: string;
  name: string;
  colors: string[];
  direction: number;
  type: 'linear' | 'radial' | 'conic';
}

interface WeatherTheme {
  condition: string;
  colors: TimeBasedTheme['colors'];
  particles?: string;
}

// Time-based theme definitions
const timeBasedThemes: TimeBasedTheme[] = [
  {
    id: 'dawn',
    name: 'Dawn',
    timeRange: [4, 6],
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFE66D',
      accent: '#FF8E53',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#FFFFFF'
    },
    icon: <Sunrise className="w-5 h-5" />,
    description: 'Gentle morning awakening'
  },
  {
    id: 'morning',
    name: 'Morning',
    timeRange: [6, 12],
    colors: {
      primary: '#4ECDC4',
      secondary: '#45B7D1',
      accent: '#F9CA24',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      surface: 'rgba(255, 255, 255, 0.15)',
      text: '#FFFFFF'
    },
    icon: <Sun className="w-5 h-5" />,
    description: 'Bright and energetic'
  },
  {
    id: 'afternoon',
    name: 'Afternoon',
    timeRange: [12, 17],
    colors: {
      primary: '#F39C12',
      secondary: '#E67E22',
      accent: '#D35400',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      surface: 'rgba(255, 255, 255, 0.2)',
      text: '#2C3E50'
    },
    icon: <Sun className="w-5 h-5" />,
    description: 'Warm and productive'
  },
  {
    id: 'evening',
    name: 'Evening',
    timeRange: [17, 20],
    colors: {
      primary: '#9B59B6',
      secondary: '#8E44AD',
      accent: '#E74C3C',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#FFFFFF'
    },
    icon: <Sunset className="w-5 h-5" />,
    description: 'Reflective and calm'
  },
  {
    id: 'night',
    name: 'Night',
    timeRange: [20, 4],
    colors: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#3498DB',
      background: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#ECF0F1'
    },
    icon: <Moon className="w-5 h-5" />,
    description: 'Peaceful and restful'
  }
];

// Weather-based themes
const weatherThemes: Record<string, WeatherTheme> = {
  sunny: {
    condition: 'sunny',
    colors: {
      primary: '#F39C12',
      secondary: '#E67E22',
      accent: '#D35400',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      surface: 'rgba(255, 255, 255, 0.2)',
      text: '#2C3E50'
    }
  },
  cloudy: {
    condition: 'cloudy',
    colors: {
      primary: '#95A5A6',
      secondary: '#7F8C8D',
      accent: '#34495E',
      background: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#2C3E50'
    }
  },
  rainy: {
    condition: 'rainy',
    colors: {
      primary: '#3498DB',
      secondary: '#2980B9',
      accent: '#1ABC9C',
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      surface: 'rgba(255, 255, 255, 0.15)',
      text: '#2C3E50'
    },
    particles: 'rain'
  }
};

export function EnhancedThemeControls() {
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'time' | 'weather' | 'custom'>('time');
  const [autoThemeEnabled, setAutoThemeEnabled] = useState(false); // Start with false to prevent hydration issues
  const [customGradients, setCustomGradients] = useState<CustomGradient[]>([]);
  const [currentGradient, setCurrentGradient] = useState<CustomGradient | null>(null);
  const [gradientColors, setGradientColors] = useState(['#667eea', '#764ba2']);
  const [gradientDirection, setGradientDirection] = useState(135);
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [previewMode, setPreviewMode] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set client state after hydration to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setAutoThemeEnabled(true);
  }, []);

  // Auto theme switching based on time
  useEffect(() => {
    if (!autoThemeEnabled || !isClient) return;

    const updateThemeByTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      const matchingTheme = timeBasedThemes.find(theme => {
        const [start, end] = theme.timeRange;
        if (start <= end) {
          return hour >= start && hour < end;
        } else {
          // Handle overnight themes (e.g., night: 20-4)
          return hour >= start || hour < end;
        }
      });

      if (matchingTheme) {
        applyTheme(matchingTheme.colors);
      }
    };

    updateThemeByTime();
    intervalRef.current = setInterval(updateThemeByTime, 60000); // Check every minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoThemeEnabled, isClient]);

  // Apply theme colors
  const applyTheme = (colors: TimeBasedTheme['colors']) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
  };

  // Custom gradient creation
  const createCustomGradient = () => {
    const newGradient: CustomGradient = {
      id: `custom_${Date.now()}`,
      name: `Custom Gradient ${customGradients.length + 1}`,
      colors: [...gradientColors],
      direction: gradientDirection,
      type: gradientType
    };
    
    setCustomGradients(prev => [...prev, newGradient]);
    setCurrentGradient(newGradient);
  };

  // Generate gradient CSS
  const generateGradientCSS = (gradient: CustomGradient) => {
    const colorStops = gradient.colors.join(', ');
    
    switch (gradient.type) {
      case 'linear':
        return `linear-gradient(${gradient.direction}deg, ${colorStops})`;
      case 'radial':
        return `radial-gradient(circle, ${colorStops})`;
      case 'conic':
        return `conic-gradient(from ${gradient.direction}deg, ${colorStops})`;
      default:
        return `linear-gradient(${gradient.direction}deg, ${colorStops})`;
    }
  };

  // Add gradient color
  const addGradientColor = () => {
    if (gradientColors.length < 5) {
      setGradientColors(prev => [...prev, '#FF6B6B']);
    }
  };

  // Remove gradient color
  const removeGradientColor = (index: number) => {
    if (gradientColors.length > 2) {
      setGradientColors(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Update gradient color
  const updateGradientColor = (index: number, color: string) => {
    setGradientColors(prev => prev.map((c, i) => i === index ? color : c));
  };

  // Export custom themes
  const exportThemes = () => {
    const exportData = {
      customGradients,
      settings: {
        autoThemeEnabled,
        currentTheme: theme
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moodscape-themes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import custom themes
  const importThemes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.customGradients) {
          setCustomGradients(data.customGradients);
        }
        if (data.settings) {
          setAutoThemeEnabled(data.settings.autoThemeEnabled);
        }
      } catch (error) {
        console.error('Failed to import themes:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-12 h-12 backdrop-blur-md rounded-full border flex items-center justify-center transition-all duration-300 ${
            theme.mode === 'light'
              ? 'bg-white/90 border-gray-200 text-gray-700 hover:bg-white hover:shadow-lg'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Palette className="w-6 h-6" />
        </motion.button>

        {/* Expanded Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-16 right-0 w-96 backdrop-blur-xl rounded-2xl border p-6 shadow-2xl ${
                theme.mode === 'light'
                  ? 'bg-white/95 border-gray-200 text-gray-900'
                  : 'bg-white/10 border-white/20 text-white'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${
                  theme.mode === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Theme Studio</h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      previewMode 
                        ? 'bg-blue-500/30 text-blue-300' 
                        : theme.mode === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={exportThemes}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      theme.mode === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <label className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    theme.mode === 'light'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}>
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept=".json"
                      onChange={importThemes}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Auto Theme Toggle */}
              <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${
                theme.mode === 'light' ? 'bg-gray-50' : 'bg-white/5'
              }`}>
                <span className={theme.mode === 'light' ? 'text-gray-700' : 'text-white/80'}>
                  Auto Time-Based
                </span>
                <motion.button
                  onClick={() => setAutoThemeEnabled(!autoThemeEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    autoThemeEnabled ? 'bg-blue-500' : theme.mode === 'light' ? 'bg-gray-300' : 'bg-white/20'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                    animate={{ x: autoThemeEnabled ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              {/* Tab Navigation */}
              <div className={`flex gap-1 mb-6 p-1 rounded-lg ${
                theme.mode === 'light' ? 'bg-gray-100' : 'bg-white/5'
              }`}>
                {['time', 'weather', 'custom'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? theme.mode === 'light'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'bg-white/20 text-white'
                        : theme.mode === 'light'
                        ? 'text-gray-600 hover:text-gray-800'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === 'time' && (
                  <div className="space-y-2">
                    {timeBasedThemes.map((timeTheme, index) => (
                      <motion.button
                        key={timeTheme.id}
                        onClick={() => applyTheme(timeTheme.colors)}
                        className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                          theme.mode === 'light'
                            ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={theme.mode === 'light' ? 'text-gray-600' : 'text-white/80'}>{timeTheme.icon}</div>
                          <div>
                            <div className={`font-medium ${
                              theme.mode === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>{timeTheme.name}</div>
                            <div className={`text-sm ${
                              theme.mode === 'light' ? 'text-gray-600' : 'text-white/60'
                            }`}>{timeTheme.description}</div>
                            <div className={`text-xs ${
                              theme.mode === 'light' ? 'text-gray-500' : 'text-white/40'
                            }`}>
                              {timeTheme.timeRange[0]}:00 - {timeTheme.timeRange[1]}:00
                            </div>
                          </div>
                          <div className="ml-auto flex gap-1">
                            {Object.values(timeTheme.colors).slice(0, 3).map((color, idx) => (
                              <div
                                key={idx}
                                className={`w-4 h-4 rounded-full border ${
                                  theme.mode === 'light' ? 'border-gray-300' : 'border-white/20'
                                }`}
                                style={{ backgroundColor: color.startsWith('#') ? color : '#667eea' }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {activeTab === 'weather' && (
                  <div className="space-y-2">
                    {Object.entries(weatherThemes).map(([key, weatherTheme], index) => (
                      <motion.button
                        key={key}
                        onClick={() => applyTheme(weatherTheme.colors)}
                        className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                          theme.mode === 'light'
                            ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={theme.mode === 'light' ? 'text-gray-600' : 'text-white/80'}>
                            {key === 'sunny' && <Sun className="w-5 h-5" />}
                            {key === 'cloudy' && <Cloud className="w-5 h-5" />}
                            {key === 'rainy' && <CloudRain className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className={`font-medium capitalize ${
                              theme.mode === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>{key}</div>
                            <div className={`text-sm ${
                              theme.mode === 'light' ? 'text-gray-600' : 'text-white/60'
                            }`}>Weather-based theme</div>
                          </div>
                          <div className="ml-auto flex gap-1">
                            {Object.values(weatherTheme.colors).slice(0, 3).map((color, idx) => (
                              <div
                                key={idx}
                                className={`w-4 h-4 rounded-full border ${
                                  theme.mode === 'light' ? 'border-gray-300' : 'border-white/20'
                                }`}
                                style={{ backgroundColor: color.startsWith('#') ? color : '#667eea' }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="space-y-4">
                    {/* Gradient Builder */}
                    <div className={`p-4 rounded-lg ${
                      theme.mode === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-white/5'
                    }`}>
                      <h4 className={`font-medium mb-3 ${
                        theme.mode === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>Gradient Builder</h4>
                      
                      {/* Preview */}
                      <div
                        className={`w-full h-16 rounded-lg mb-4 border ${
                          theme.mode === 'light' ? 'border-gray-300' : 'border-white/20'
                        }`}
                        style={{
                          background: generateGradientCSS({
                            id: 'preview',
                            name: 'Preview',
                            colors: gradientColors,
                            direction: gradientDirection,
                            type: gradientType
                          })
                        }}
                      />

                      {/* Gradient Type */}
                      <div className="mb-3">
                        <label className={`text-sm mb-2 block ${
                          theme.mode === 'light' ? 'text-gray-700' : 'text-white/80'
                        }`}>Type</label>
                        <div className="flex gap-2">
                          {['linear', 'radial', 'conic'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setGradientType(type as any)}
                              className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                                gradientType === type
                                  ? 'bg-blue-500/30 text-blue-300'
                                  : theme.mode === 'light'
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'bg-white/10 text-white/60 hover:bg-white/20'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Direction Slider */}
                      {gradientType !== 'radial' && (
                        <div className="mb-3">
                          <label className={`text-sm mb-2 block ${
                            theme.mode === 'light' ? 'text-gray-700' : 'text-white/80'
                          }`}>
                            Direction: {gradientDirection}°
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientDirection}
                            onChange={(e) => setGradientDirection(Number(e.target.value))}
                            className={`w-full h-2 rounded-lg appearance-none slider ${
                              theme.mode === 'light' ? 'bg-gray-300' : 'bg-white/20'
                            }`}
                          />
                        </div>
                      )}

                      {/* Color Stops */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className={`text-sm ${
                            theme.mode === 'light' ? 'text-gray-700' : 'text-white/80'
                          }`}>Colors</label>
                          <button
                            onClick={addGradientColor}
                            className={`text-sm transition-colors ${
                              theme.mode === 'light' 
                                ? 'text-blue-600 hover:text-blue-800'
                                : 'text-blue-300 hover:text-blue-200'
                            }`}
                            disabled={gradientColors.length >= 5}
                          >
                            + Add Color
                          </button>
                        </div>
                        <div className="space-y-2">
                          {gradientColors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => updateGradientColor(index, e.target.value)}
                                className={`w-8 h-8 rounded border bg-transparent ${
                                  theme.mode === 'light' ? 'border-gray-300' : 'border-white/20'
                                }`}
                              />
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => updateGradientColor(index, e.target.value)}
                                className={`flex-1 px-2 py-1 border rounded text-sm ${
                                  theme.mode === 'light'
                                    ? 'bg-white border-gray-300 text-gray-900'
                                    : 'bg-white/10 border-white/20 text-white'
                                }`}
                              />
                              {gradientColors.length > 2 && (
                                <button
                                  onClick={() => removeGradientColor(index)}
                                  className={`transition-colors ${
                                    theme.mode === 'light'
                                      ? 'text-red-600 hover:text-red-800'
                                      : 'text-red-400 hover:text-red-300'
                                  }`}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={createCustomGradient}
                        className={`w-full py-2 rounded-lg transition-all duration-200 ${
                          theme.mode === 'light'
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                            : 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-300'
                        }`}
                      >
                        Save Gradient
                      </button>
                    </div>

                    {/* Saved Gradients */}
                    {customGradients.length > 0 && (
                      <div>
                        <h4 className={`font-medium mb-3 ${
                          theme.mode === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>Saved Gradients</h4>
                        <div className="space-y-2">
                          {customGradients.map((gradient) => (
                            <motion.button
                              key={gradient.id}
                              onClick={() => setCurrentGradient(gradient)}
                              className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                                theme.mode === 'light'
                                  ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded border ${
                                    theme.mode === 'light' ? 'border-gray-300' : 'border-white/20'
                                  }`}
                                  style={{ background: generateGradientCSS(gradient) }}
                                />
                                <div>
                                  <div className={`font-medium ${
                                    theme.mode === 'light' ? 'text-gray-900' : 'text-white'
                                  }`}>{gradient.name}</div>
                                  <div className={`text-sm ${
                                    theme.mode === 'light' ? 'text-gray-600' : 'text-white/60'
                                  }`}>{gradient.type} gradient</div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}