'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePersonalization } from '@/contexts/personalization-context';
import { useTheme } from '@/contexts/theme-context';

interface WeeklyWordsProps {
  className?: string;
}

export function WeeklyWords({ className = '' }: WeeklyWordsProps) {
  const { weeklyWords } = usePersonalization();
  const { theme } = useTheme();

  // Ensure weeklyWords is an array before trying to map over it
  if (!weeklyWords || !Array.isArray(weeklyWords) || weeklyWords.length === 0) {
    return null;
  }

  // Adjust styling based on theme mode - 80% opacity for light mode
  const getWordClasses = () => {
    if (theme.mode === 'light') {
      return "px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium border border-gray-300 text-gray-800 shadow-sm";
    }
    return "px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 text-white";
  };

  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {weeklyWords.map((word, index) => (
        <motion.span
          key={index}
          className={getWordClasses()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}