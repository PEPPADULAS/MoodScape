'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePersonalization } from '@/contexts/personalization-context';
import { useTheme } from '@/contexts/theme-context';
import { Lightbulb } from 'lucide-react';

interface WritingPromptProps {
  className?: string;
  userEntries?: any[];
}

export function WritingPrompt({ className = '', userEntries = [] }: WritingPromptProps) {
  const { personalizedPrompt, generatePersonalizedPrompt } = usePersonalization();
  const { theme } = useTheme();

  // Generate prompt when user entries change
  useEffect(() => {
    generatePersonalizedPrompt(userEntries);
  }, [userEntries, generatePersonalizedPrompt]);

  // Adjust styling based on theme mode - 80% opacity for light mode
  const getContainerClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-300 shadow-sm ${className}`;
    }
    return `bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`;
  };

  const getTitleClasses = () => {
    if (theme.mode === 'light') {
      return "text-sm font-medium text-gray-700 mb-2";
    }
    return "text-sm font-medium text-white/80 mb-2";
  };

  const getTextClasses = () => {
    if (theme.mode === 'light') {
      return "text-gray-800";
    }
    return "text-white/90";
  };

  const getLightbulbClasses = () => {
    if (theme.mode === 'light') {
      return "w-5 h-5 text-gray-400 flex-shrink-0 mt-1";
    }
    return "w-5 h-5 text-white/60 flex-shrink-0 mt-1";
  };

  const getLoadingClasses = () => {
    if (theme.mode === 'light') {
      return `h-4 bg-gray-200 rounded`;
    }
    return `h-4 bg-white/20 rounded`;
  };

  if (!personalizedPrompt) {
    return (
      <div className={getContainerClasses()}>
        <div className="animate-pulse">
          <div className={`${getLoadingClasses()} w-full mb-3`}></div>
          <div className={`${getLoadingClasses()} w-5/6`}></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={getContainerClasses()}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-3">
        <Lightbulb className={getLightbulbClasses()} />
        <div>
          <h3 className={getTitleClasses()}>Writing Prompt</h3>
          <p className={getTextClasses()}>{personalizedPrompt}</p>
        </div>
      </div>
    </motion.div>
  );
}