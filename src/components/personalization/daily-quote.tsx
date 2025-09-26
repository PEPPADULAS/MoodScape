'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePersonalization } from '@/contexts/personalization-context';
import { useTheme } from '@/contexts/theme-context';
import { Quote as QuoteIcon } from 'lucide-react';

interface DailyQuoteProps {
  className?: string;
  mood?: string;
}

export function DailyQuote({ className = '', mood }: DailyQuoteProps) {
  const { currentQuote, updateQuote } = usePersonalization();
  const { theme } = useTheme();

  // Update quote when mood changes
  React.useEffect(() => {
    if (mood) {
      updateQuote(mood);
    }
  }, [mood, updateQuote]);

  // Adjust styling based on theme mode - 80% opacity for light mode
  const getContainerClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-300 shadow-sm ${className}`;
    }
    return `bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`;
  };

  const getTextClasses = () => {
    if (theme.mode === 'light') {
      return "text-lg italic text-gray-800 mb-3";
    }
    return "text-lg italic text-white/90 mb-3";
  };

  const getAuthorClasses = () => {
    if (theme.mode === 'light') {
      return "text-sm text-gray-600";
    }
    return "text-sm text-white/70";
  };

  const getCategoryClasses = () => {
    if (theme.mode === 'light') {
      return "px-2 py-1 bg-gray-100 rounded text-xs text-gray-700";
    }
    return "px-2 py-1 bg-white/10 rounded text-xs text-white/80";
  };

  const getQuoteIconClasses = () => {
    if (theme.mode === 'light') {
      return "w-5 h-5 text-gray-400 flex-shrink-0 mt-1";
    }
    return "w-5 h-5 text-white/60 flex-shrink-0 mt-1";
  };

  if (!currentQuote) {
    return (
      <div className={getContainerClasses()}>
        <div className="animate-pulse">
          <div className={`h-4 ${theme.mode === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded w-3/4 mb-4`}></div>
          <div className={`h-3 ${theme.mode === 'light' ? 'bg-gray-200' : 'bg-white/20'} rounded w-1/2`}></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={getContainerClasses()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-3">
        <QuoteIcon className={getQuoteIconClasses()} />
        <div>
          <p className={getTextClasses()}>"{currentQuote.text}"</p>
          <p className={getAuthorClasses()}>— {currentQuote.author}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={getCategoryClasses()}>
              {currentQuote.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}