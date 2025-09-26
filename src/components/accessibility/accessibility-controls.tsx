'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Palette, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Settings,
  Contrast,
  Focus,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useSettings } from '@/contexts/settings-context';

interface AccessibilityControlsProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export function AccessibilityControls({ isVisible = false, onToggle }: AccessibilityControlsProps) {
  const { theme, toggleMode } = useTheme();
  const { 
    fontSize: contextFontSize, 
    setFontSize: setContextFontSize,
    highContrastMode, 
    setHighContrastMode,
    reducedMotion, 
    setReducedMotion,
    colorScheme,
    setColorScheme
  } = useSettings();
  
  const [fontSize, setFontSize] = useState(16);
  const [focusMode, setFocusMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('none');

  // Initialize accessibility preferences
  useEffect(() => {
    const savedPrefs = localStorage.getItem('accessibility-preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setFontSize(prefs.fontSize || 16);
      setFocusMode(prefs.focusMode || false);
      setColorBlindMode(prefs.colorBlindMode || 'none');
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(prefersReducedMotion.matches);

    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    setHighContrastMode(prefersHighContrast.matches);
  }, [setReducedMotion, setHighContrastMode]);

  // Save preferences whenever they change
  useEffect(() => {
    const preferences = {
      fontSize,
      highContrast: highContrastMode,
      reducedMotion,
      focusMode,
      colorBlindMode
    };
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.classList.toggle('high-contrast', highContrastMode);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    document.documentElement.classList.toggle('focus-mode', focusMode);
    document.documentElement.setAttribute('data-colorblind-mode', colorBlindMode);
  }, [fontSize, highContrastMode, reducedMotion, focusMode, colorBlindMode]);

  // Update font size when settings context changes
  useEffect(() => {
    const sizeMap = {
      'small': 14,
      'medium': 16,
      'large': 18
    };
    setFontSize(sizeMap[contextFontSize]);
  }, [contextFontSize]);

  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + increment));
    setFontSize(newSize);
    // Map the numeric font size to the settings context values
    if (newSize <= 14) {
      setContextFontSize('small');
    } else if (newSize >= 18) {
      setContextFontSize('large');
    } else {
      setContextFontSize('medium');
    }
  };

  if (!isVisible) {
    return (
      <motion.button
        onClick={onToggle}
        className={`fixed bottom-4 left-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 border ${
          theme.mode === 'light'
            ? 'bg-white border-gray-200 text-gray-700 hover:shadow-xl'
            : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
        }`}
        whileHover={reducedMotion ? {} : { scale: 1.05 }}
        whileTap={reducedMotion ? {} : { scale: 0.95 }}
        aria-label="Open accessibility controls"
      >
        <Settings className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0, scale: 0.9, y: 20 }}
      animate={reducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
      className={`fixed bottom-4 left-4 z-50 p-6 rounded-2xl shadow-2xl backdrop-blur-md border max-w-sm ${
        theme.mode === 'light'
          ? 'bg-white/95 border-gray-200 text-gray-900'
          : 'bg-gray-900/95 border-gray-700 text-white'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Accessibility</h3>
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${
            theme.mode === 'light'
              ? 'hover:bg-gray-100 text-gray-600'
              : 'hover:bg-gray-800 text-gray-400'
          }`}
          aria-label="Close accessibility controls"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* Font Size Controls */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-3 ${
          theme.mode === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Font Size: {contextFontSize}
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustFontSize(-2)}
            className={`p-2 rounded-lg transition-colors ${
              theme.mode === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            aria-label="Decrease font size"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center text-sm">{contextFontSize}</div>
          <button
            onClick={() => adjustFontSize(2)}
            className={`p-2 rounded-lg transition-colors ${
              theme.mode === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            aria-label="Increase font size"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="space-y-4">
        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4" />
            <span className="text-sm">High Contrast</span>
          </div>
          <button
            onClick={() => setHighContrastMode(!highContrastMode)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              highContrastMode
                ? 'bg-blue-500'
                : theme.mode === 'light'
                ? 'bg-gray-300'
                : 'bg-gray-600'
            }`}
            aria-label={`${highContrastMode ? 'Disable' : 'Enable'} high contrast`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-sm"
              animate={reducedMotion ? { x: highContrastMode ? 22 : 2 } : { x: highContrastMode ? 22 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={reducedMotion ? { rotate: 0 } : { rotate: 360 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity }}
            >
              <Settings className="w-4 h-4" />
            </motion.div>
            <span className="text-sm">Reduced Motion</span>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              reducedMotion
                ? 'bg-blue-500'
                : theme.mode === 'light'
                ? 'bg-gray-300'
                : 'bg-gray-600'
            }`}
            aria-label={`${reducedMotion ? 'Disable' : 'Enable'} reduced motion`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-sm"
              animate={reducedMotion ? { x: reducedMotion ? 22 : 2 } : { x: reducedMotion ? 22 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Focus Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Focus className="w-4 h-4" />
            <span className="text-sm">Focus Mode</span>
          </div>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              focusMode
                ? 'bg-blue-500'
                : theme.mode === 'light'
                ? 'bg-gray-300'
                : 'bg-gray-600'
            }`}
            aria-label={`${focusMode ? 'Disable' : 'Enable'} focus mode`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-sm"
              animate={reducedMotion ? { x: focusMode ? 22 : 2 } : { x: focusMode ? 22 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="text-sm">Dark Mode</span>
          </div>
          <button
            onClick={toggleMode}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              theme.mode === 'dark'
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
            aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-sm"
              animate={reducedMotion ? { x: theme.mode === 'dark' ? 22 : 2 } : { x: theme.mode === 'dark' ? 22 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="mt-6">
        <label className={`block text-sm font-medium mb-2 ${
          theme.mode === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Color Scheme
        </label>
        <select
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value as any)}
          className={`w-full p-2 rounded-lg border text-sm ${
            theme.mode === 'light'
              ? 'bg-white border-gray-300 text-gray-900'
              : 'bg-gray-800 border-gray-600 text-white'
          }`}
        >
          <option value="default">Default</option>
          <option value="high-contrast">High Contrast</option>
          <option value="desaturated">Desaturated</option>
        </select>
      </div>

      {/* Color Blind Support */}
      <div className="mt-6">
        <label className={`block text-sm font-medium mb-2 ${
          theme.mode === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Color Vision Support
        </label>
        <select
          value={colorBlindMode}
          onChange={(e) => setColorBlindMode(e.target.value as any)}
          className={`w-full p-2 rounded-lg border text-sm ${
            theme.mode === 'light'
              ? 'bg-white border-gray-300 text-gray-900'
              : 'bg-gray-800 border-gray-600 text-white'
          }`}
        >
          <option value="none">Normal Vision</option>
          <option value="protanopia">Protanopia (Red-blind)</option>
          <option value="deuteranopia">Deuteranopia (Green-blind)</option>
          <option value="tritanopia">Tritanopia (Blue-blind)</option>
        </select>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
        <div className="text-xs space-y-1 opacity-70">
          <div>Ctrl/Cmd + D: Toggle theme</div>
          <div>Ctrl/Cmd + +/-: Adjust font size</div>
          <div>Ctrl/Cmd + Alt + C: High contrast</div>
          <div>Ctrl/Cmd + Alt + M: Reduced motion</div>
        </div>
      </div>
    </motion.div>
  );
}