'use client';

import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { useTheme } from '@/contexts/theme-context';
import { 
  Keyboard,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Zap,
  Eye
} from 'lucide-react';

export default function KeyboardSettings() {
  const { 
    keyboardNavEnabled, 
    setKeyboardNavEnabled,
    reducedMotion
  } = useSettings();

  const { theme } = useTheme();

  const shortcuts = [
    { keys: ['←', 'H'], action: 'Previous Page' },
    { keys: ['→', 'L'], action: 'Next Page' },
    { keys: ['Shift', '?'], action: 'Show Help' },
    { keys: ['Esc'], action: 'Close Modals' }
  ];

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
      <h3 className={`text-xl font-semibold ${getTextColor()} mb-6`}>Keyboard Settings</h3>
      
      {/* Keyboard Navigation Toggle */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Keyboard Navigation</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            <Keyboard className="w-5 h-5 text-blue-500" />
            <span className={`font-medium ${getTextColor()}`}>
              Enable Keyboard Navigation
            </span>
          </div>
          <motion.button
            onClick={() => setKeyboardNavEnabled(!keyboardNavEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              keyboardNavEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={reducedMotion ? { x: keyboardNavEnabled ? 26 : 2 } : { x: keyboardNavEnabled ? 26 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
        <p className={`mt-2 text-sm ${getSubtleTextColor()}`}>
          Navigate between pages using keyboard shortcuts
        </p>
      </div>
      
      {/* Keyboard Shortcuts */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Keyboard Shortcuts</h4>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}
            >
              <span className={getTextColor()}>{shortcut.action}</span>
              <div className="flex space-x-2">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd 
                    key={keyIndex}
                    className={`px-3 py-1.5 text-sm font-mono rounded-lg border ${
                      theme.mode === 'light' 
                        ? 'bg-gray-100 border-gray-300 text-gray-800' 
                        : 'bg-gray-700 border-gray-600 text-gray-200'
                    }`}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shortcut Visualization */}
      <div className={`p-6 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
        <h5 className={`font-medium ${getTextColor()} mb-4 flex items-center`}>
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Navigation Visualization
        </h5>
        <div className="flex items-center justify-center space-x-8">
          <motion.div
            className="flex flex-col items-center"
            whileHover={reducedMotion ? {} : { scale: 1.1 }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg border ${
              theme.mode === 'light' 
                ? 'bg-blue-100 border-blue-300' 
                : 'bg-blue-900/50 border-blue-700'
            }`}>
              <ArrowLeft className={`w-6 h-6 ${
                theme.mode === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`} />
            </div>
            <span className={`mt-2 text-sm ${getSubtleTextColor()}`}>Previous</span>
          </motion.div>
          
          <div className={`text-2xl ${theme.mode === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>← →</div>
          
          <motion.div
            className="flex flex-col items-center"
            whileHover={reducedMotion ? {} : { scale: 1.1 }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg border ${
              theme.mode === 'light' 
                ? 'bg-blue-100 border-blue-300' 
                : 'bg-blue-900/50 border-blue-700'
            }`}>
              <ArrowRight className={`w-6 h-6 ${
                theme.mode === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`} />
            </div>
            <span className={`mt-2 text-sm ${getSubtleTextColor()}`}>Next</span>
          </motion.div>
        </div>
        <p className={`mt-4 text-center text-sm ${getSubtleTextColor()}`}>
          Use arrow keys or H/L to navigate between pages
        </p>
      </div>
    </div>
  );
}