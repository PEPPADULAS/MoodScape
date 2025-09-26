'use client';

import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { useTheme } from '@/contexts/theme-context';
import { 
  Accessibility,
  Contrast,
  Zap,
  Eye,
  Palette,
  Text
} from 'lucide-react';

export default function AccessibilitySettings() {
  const { 
    highContrastMode, 
    setHighContrastMode,
    reducedMotion,
    setReducedMotion,
    fontSize,
    setFontSize,
    colorScheme,
    setColorScheme
  } = useSettings();

  const { theme } = useTheme();

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
      <h3 className={`text-xl font-semibold ${getTextColor()} mb-6`}>Accessibility Settings</h3>
      
      {/* High Contrast Mode */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>High Contrast Mode</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            <Contrast className="w-5 h-5 text-orange-500" />
            <span className={`font-medium ${getTextColor()}`}>
              Enhanced Contrast
            </span>
          </div>
          <motion.button
            onClick={() => setHighContrastMode(!highContrastMode)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              highContrastMode ? 'bg-orange-500' : 'bg-gray-300'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={{ x: highContrastMode ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
        <p className={`mt-2 text-sm ${getSubtleTextColor()}`}>
          Increases contrast between text and background for better readability
        </p>
      </div>
      
      {/* Reduced Motion */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Reduced Motion</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-red-500" />
            <span className={`font-medium ${getTextColor()}`}>
              Minimize Animations
            </span>
          </div>
          <motion.button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              reducedMotion ? 'bg-red-500' : 'bg-gray-300'
            }`}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={reducedMotion ? { x: reducedMotion ? 26 : 2 } : { x: reducedMotion ? 26 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
        <p className={`mt-2 text-sm ${getSubtleTextColor()}`}>
          Reduces animations and transitions for users with motion sensitivity
        </p>
      </div>
      
      {/* Font Size */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Text Size</h4>
        <div className="grid grid-cols-3 gap-3">
          {([
            { id: 'small', label: 'Small', icon: 'A' },
            { id: 'medium', label: 'Medium', icon: 'A' },
            { id: 'large', label: 'Large', icon: 'A' }
          ] as const).map((size) => (
            <motion.button
              key={size.id}
              onClick={() => setFontSize(size.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                fontSize === size.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                  : `${getCardBgColor()} border ${getBorderColor()} hover:bg-gray-50 dark:hover:bg-white/20`
              }`}
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
            >
              <span className={`font-medium ${
                size.id === 'small' ? 'text-sm' : 
                size.id === 'medium' ? 'text-base' : 'text-lg'
              } ${getTextColor()}`}>
                {size.icon}
              </span>
              <span className={`text-xs mt-2 ${getSubtleTextColor()}`}>
                {size.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Color Scheme */}
      <div>
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Color Scheme</h4>
        <div className="grid grid-cols-3 gap-3">
          {([
            { id: 'default', label: 'Default', description: 'Standard colors' },
            { id: 'high-contrast', label: 'High Contrast', description: 'Enhanced visibility' },
            { id: 'desaturated', label: 'Desaturated', description: 'Reduced color intensity' }
          ] as const).map((scheme) => (
            <motion.button
              key={scheme.id}
              onClick={() => setColorScheme(scheme.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                colorScheme === scheme.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                  : `${getCardBgColor()} border ${getBorderColor()} hover:bg-gray-50 dark:hover:bg-white/20`
              }`}
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
            >
              <Palette className={`w-6 h-6 mb-2 ${theme.mode === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
              <span className={`font-medium ${getTextColor()}`}>
                {scheme.label}
              </span>
              <span className={`text-xs mt-1 ${getSubtleTextColor()}`}>
                {scheme.description}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}