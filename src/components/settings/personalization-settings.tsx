'use client';

import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { usePersonalization } from '@/contexts/personalization-context';
import { useTheme } from '@/contexts/theme-context';
import { 
  Sparkles,
  Calendar,
  Quote,
  PenTool,
  RotateCcw
} from 'lucide-react';

export default function PersonalizationSettings() {
  const { 
    weeklyWordsEnabled, 
    setWeeklyWordsEnabled,
    dailyQuotesEnabled,
    setDailyQuotesEnabled,
    writingPromptsEnabled,
    setWritingPromptsEnabled,
    reducedMotion
  } = useSettings();
  
  const { updateWeeklyWords, updateQuote } = usePersonalization();
  const { theme } = useTheme();

  const handleRefreshWeeklyWords = () => {
    updateWeeklyWords();
  };

  const handleRefreshDailyQuote = () => {
    updateQuote();
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
      <h3 className={`text-xl font-semibold ${getTextColor()} mb-6`}>Personalization Settings</h3>
      
      {/* Weekly Theme Words */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Weekly Theme Words</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className={`font-medium ${getTextColor()}`}>
              Display Weekly Themes
            </span>
          </div>
          <motion.button
            onClick={() => setWeeklyWordsEnabled(!weeklyWordsEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              weeklyWordsEnabled ? 'bg-purple-500' : 'bg-gray-300'
            }`}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={reducedMotion ? { x: weeklyWordsEnabled ? 26 : 2 } : { x: weeklyWordsEnabled ? 26 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
        <div className="mt-3 flex justify-end">
          <motion.button
            onClick={handleRefreshWeeklyWords}
            className={`flex items-center space-x-1 text-sm ${theme.mode === 'light' ? 'text-purple-600 hover:text-purple-800' : 'text-purple-400 hover:text-purple-300'}`}
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refresh Themes</span>
          </motion.button>
        </div>
      </div>
      
      {/* Daily Quotes */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Daily Inspirational Quotes</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            <Quote className="w-5 h-5 text-green-500" />
            <span className={`font-medium ${getTextColor()}`}>
              Display Daily Quotes
            </span>
          </div>
          <motion.button
            onClick={() => setDailyQuotesEnabled(!dailyQuotesEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              dailyQuotesEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={reducedMotion ? { x: dailyQuotesEnabled ? 26 : 2 } : { x: dailyQuotesEnabled ? 26 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
        <div className="mt-3 flex justify-end">
          <motion.button
            onClick={handleRefreshDailyQuote}
            className={`flex items-center space-x-1 text-sm ${theme.mode === 'light' ? 'text-green-600 hover:text-green-800' : 'text-green-400 hover:text-green-300'}`}
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refresh Quote</span>
          </motion.button>
        </div>
      </div>
      
      {/* Writing Prompts */}
      <div className="mb-8">
        <h4 className={`font-medium ${getTextColor()} mb-4`}>Personalized Writing Prompts</h4>
        <div className={`flex items-center justify-between p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
          <div className="flex items-center space-x-3">
            <PenTool className="w-5 h-5 text-blue-500" />
            <span className={`font-medium ${getTextColor()}`}>
              Display Writing Prompts
            </span>
          </div>
          <motion.button
            onClick={() => setWritingPromptsEnabled(!writingPromptsEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              writingPromptsEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={reducedMotion ? { x: writingPromptsEnabled ? 26 : 2 } : { x: writingPromptsEnabled ? 26 : 2 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
      </div>
      
      {/* Personalization Explanation */}
      <div className={`p-4 rounded-xl ${getCardBgColor()} border ${getBorderColor()}`}>
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className={`font-medium ${getTextColor()} mb-1`}>Personalization</h5>
            <p className={`text-sm ${getSubtleTextColor()}`}>
              These features enhance your MoodScape experience by providing personalized content 
              based on your journaling patterns and preferences. You can enable or disable each 
              feature independently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}