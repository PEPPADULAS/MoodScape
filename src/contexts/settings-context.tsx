'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  // Keyboard navigation settings
  keyboardNavEnabled: boolean;
  setKeyboardNavEnabled: (enabled: boolean) => void;
  
  // Personalization settings
  weeklyWordsEnabled: boolean;
  setWeeklyWordsEnabled: (enabled: boolean) => void;
  dailyQuotesEnabled: boolean;
  setDailyQuotesEnabled: (enabled: boolean) => void;
  writingPromptsEnabled: boolean;
  setWritingPromptsEnabled: (enabled: boolean) => void;
  
  // Accessibility settings
  highContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  colorScheme: 'default' | 'high-contrast' | 'desaturated';
  setColorScheme: (scheme: 'default' | 'high-contrast' | 'desaturated') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [keyboardNavEnabled, setKeyboardNavEnabled] = useState(true);
  const [weeklyWordsEnabled, setWeeklyWordsEnabled] = useState(true);
  const [dailyQuotesEnabled, setDailyQuotesEnabled] = useState(true);
  const [writingPromptsEnabled, setWritingPromptsEnabled] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorScheme, setColorScheme] = useState<'default' | 'high-contrast' | 'desaturated'>('default');

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKeyboardNav = localStorage.getItem('moodscape-keyboard-nav');
      const savedWeeklyWords = localStorage.getItem('moodscape-weekly-words');
      const savedDailyQuotes = localStorage.getItem('moodscape-daily-quotes');
      const savedWritingPrompts = localStorage.getItem('moodscape-writing-prompts');
      const savedHighContrast = localStorage.getItem('moodscape-high-contrast');
      const savedReducedMotion = localStorage.getItem('moodscape-reduced-motion');
      const savedFontSize = localStorage.getItem('moodscape-font-size');
      const savedColorScheme = localStorage.getItem('moodscape-color-scheme');
      
      if (savedKeyboardNav !== null) setKeyboardNavEnabled(savedKeyboardNav === 'true');
      if (savedWeeklyWords !== null) setWeeklyWordsEnabled(savedWeeklyWords === 'true');
      if (savedDailyQuotes !== null) setDailyQuotesEnabled(savedDailyQuotes === 'true');
      if (savedWritingPrompts !== null) setWritingPromptsEnabled(savedWritingPrompts === 'true');
      if (savedHighContrast !== null) setHighContrastMode(savedHighContrast === 'true');
      if (savedReducedMotion !== null) setReducedMotion(savedReducedMotion === 'true');
      if (savedFontSize && (savedFontSize === 'small' || savedFontSize === 'medium' || savedFontSize === 'large')) 
        setFontSize(savedFontSize);
      if (savedColorScheme && (savedColorScheme === 'default' || savedColorScheme === 'high-contrast' || savedColorScheme === 'desaturated')) 
        setColorScheme(savedColorScheme);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-keyboard-nav', keyboardNavEnabled.toString());
    }
  }, [keyboardNavEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-weekly-words', weeklyWordsEnabled.toString());
    }
  }, [weeklyWordsEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-daily-quotes', dailyQuotesEnabled.toString());
    }
  }, [dailyQuotesEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-writing-prompts', writingPromptsEnabled.toString());
    }
  }, [writingPromptsEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-high-contrast', highContrastMode.toString());
    }
  }, [highContrastMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-reduced-motion', reducedMotion.toString());
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-font-size', fontSize);
    }
  }, [fontSize]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moodscape-color-scheme', colorScheme);
    }
  }, [colorScheme]);

  return (
    <SettingsContext.Provider
      value={{
        keyboardNavEnabled,
        setKeyboardNavEnabled,
        weeklyWordsEnabled,
        setWeeklyWordsEnabled,
        dailyQuotesEnabled,
        setDailyQuotesEnabled,
        writingPromptsEnabled,
        setWritingPromptsEnabled,
        highContrastMode,
        setHighContrastMode,
        reducedMotion,
        setReducedMotion,
        fontSize,
        setFontSize,
        colorScheme,
        setColorScheme
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}