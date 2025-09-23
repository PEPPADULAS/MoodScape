'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';

interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface ThemedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

interface ThemedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

export function ThemedInput({ className = '', ...props }: ThemedInputProps) {
  const { theme } = useTheme();
  
  const baseClasses = `w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`;
  const themeClasses = theme.mode === 'light' 
    ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white' 
    : 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800';

  return (
    <input
      {...props}
      className={`${baseClasses} ${themeClasses}`}
    />
  );
}

export function ThemedTextarea({ className = '', ...props }: ThemedTextareaProps) {
  const { theme } = useTheme();
  
  const baseClasses = `w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${className}`;
  const themeClasses = theme.mode === 'light' 
    ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white' 
    : 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800';

  return (
    <textarea
      {...props}
      className={`${baseClasses} ${themeClasses}`}
    />
  );
}

export function ThemedSelect({ className = '', children, ...props }: ThemedSelectProps) {
  const { theme } = useTheme();
  
  const baseClasses = `w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`;
  const themeClasses = theme.mode === 'light' 
    ? 'bg-white border-gray-200 text-gray-900 focus:bg-white' 
    : 'bg-gray-800 border-gray-600 text-white focus:bg-gray-800';

  return (
    <select
      {...props}
      className={`${baseClasses} ${themeClasses}`}
    >
      {children}
    </select>
  );
}