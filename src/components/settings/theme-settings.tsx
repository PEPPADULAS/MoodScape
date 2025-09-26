'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { useSettings } from '@/contexts/settings-context';
import { 
  Sun, 
  Moon, 
  Palette,
  Clock,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Eye
} from 'lucide-react';

export default function ThemeSettings() {
  const { 
    theme, 
    themeMode, 
    toggleMode, 
    autoTheme, 
    setAutoTheme,
    currentTheme,
    setTheme
  } = useTheme();
  
  const { reducedMotion } = useSettings();

  const themes = [
    { id: 'spring', name: 'Spring', emoji: '🌸' },
    { id: 'summer', name: 'Summer', emoji: '☀️' },
    { id: 'fall', name: 'Fall', emoji: '🍂' },
    { id: 'winter', name: 'Winter', emoji: '❄️' },
    { id: 'rainy', name: 'Rainy', emoji: '🌧️' },
    { id: 'spring-dark', name: 'Spring Dark', emoji: '🌙' },
    { id: 'summer-dark', name: 'Summer Dark', emoji: '🌌' },
    { id: 'fall-dark', name: 'Fall Dark', emoji: '🌑' },
    { id: 'winter-dark', name: 'Winter Dark', emoji: '🌨️' },
    { id: 'rainy-dark', name: 'Rainy Dark', emoji: '☔' }
  ];

  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'spring': case 'spring-dark': return Sun;
      case 'summer': case 'summer-dark': return Sun;
      case 'fall': case 'fall-dark': return Wind;
      case 'winter': case 'winter-dark': return CloudSnow;
      case 'rainy': case 'rainy-dark': return CloudRain;
      default: return Palette;
    }
  };

  // Get text color based on theme mode
  const getTextColor = () => {
    return theme.mode === 'light' ? 'text-gray-900' : 'text-white';
  };

  // Get subtle text color based on theme mode
  const getSubtleTextColor = () => {
    return theme.mode === 'light' ? 'text-gray-600' : 'text-gray-400';
  };

  // Get background color for settings cards
  const getCardBgColor = () => {
    return theme.mode === 'light' ? 'bg-white/80' : 'bg-white/10';
  };

  // Get border color for settings cards
  const getBorderColor = () => {
    return theme.mode === 'light' ? 'border-gray-300' : 'border-white/20';
  };

  return (
    <div>
      <h3 className={`text-xl font-semibold ${getTextColor()} mb-6`}>Theme Settings</h3>
      
      {/* Theme Mode Toggle */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Theme Mode</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            {themeMode === 'light' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-400" />}
            <span className={`font-medium ${getTextColor()}`}>
              {themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
          <motion.button
            onClick={toggleMode}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              themeMode === 'dark' ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={reducedMotion ? { x: themeMode === 'dark' ? 26 : 2 } : { x: themeMode === 'dark' ? 26 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
      </div>
      
      {/* Auto Theme Toggle */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Auto Theme</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className={`font-medium ${getTextColor()}`}>
              Time-Based Theme
            </span>
          </div>
          <motion.button
            onClick={() => setAutoTheme(!autoTheme)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              autoTheme ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={reducedMotion ? { x: autoTheme ? 26 : 2 } : { x: autoTheme ? 26 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
        <p className={`mt-2 text-sm ${getSubtleTextColor()}`}>
          Automatically change theme based on time of day
        </p>
      </div>
      
      {/* Theme Selection */}
      <div>
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Select Theme</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {themes.map((themeItem) => {
            const IconComponent = getThemeIcon(themeItem.id);
            const isSelected = currentTheme === themeItem.id;
            
            return (
              <motion.button
                key={themeItem.id}
                onClick={() => setTheme(themeItem.id as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                    : `${getCardBgColor()} border ${getBorderColor()} hover:bg-gray-50 dark:hover:bg-white/20`
                }`}
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                <IconComponent className={`w-6 h-6 mb-2 ${theme.mode === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${getTextColor()}`}>
                  {themeItem.emoji}
                </span>
                <span className={`text-xs mt-1 ${getSubtleTextColor()}`}>
                  {themeItem.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}