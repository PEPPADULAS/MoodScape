import { useState, useEffect } from 'react';
import { FontOption, LanguageOption, UserPreferences, EntryCustomization } from '../types/customization';
import { FONT_OPTIONS } from '../data/fonts';
import { LANGUAGE_OPTIONS } from '../data/languages';

const STORAGE_KEYS = {
  USER_PREFERENCES: 'moodscape_user_preferences',
  ENTRY_CUSTOMIZATIONS: 'moodscape_entry_customizations'
};

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultFont: 'inter',
  defaultLanguage: 'en',
  perEntryCustomization: false
};

export function useCustomization() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [currentFont, setCurrentFont] = useState<FontOption | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption | null>(null);
  const [entryCustomizations, setEntryCustomizations] = useState<Record<string, EntryCustomization>>({});

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
    }

    const savedCustomizations = localStorage.getItem(STORAGE_KEYS.ENTRY_CUSTOMIZATIONS);
    if (savedCustomizations) {
      setEntryCustomizations(JSON.parse(savedCustomizations));
    }
  }, []);

  // Update current font and language when preferences change
  useEffect(() => {
    const font = FONT_OPTIONS.find(f => f.id === preferences.defaultFont);
    const language = LANGUAGE_OPTIONS.find(l => l.code === preferences.defaultLanguage);
    
    setCurrentFont(font || FONT_OPTIONS[0]);
    setCurrentLanguage(language || LANGUAGE_OPTIONS[0]);
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
  };

  const setEntryCustomization = (entryId: string, customization: EntryCustomization) => {
    const updated = { ...entryCustomizations, [entryId]: customization };
    setEntryCustomizations(updated);
    localStorage.setItem(STORAGE_KEYS.ENTRY_CUSTOMIZATIONS, JSON.stringify(updated));
  };

  const getEntryCustomization = (entryId: string): EntryCustomization => {
    return entryCustomizations[entryId] || {
      fontId: preferences.defaultFont,
      languageCode: preferences.defaultLanguage,
      fontSize: 16,
      lineHeight: 1.6
    };
  };

  const loadGoogleFonts = (fonts: FontOption[]) => {
    const googleFonts = fonts.filter(font => font.googleFont);
    if (googleFonts.length === 0) return;

    const fontFamilies = googleFonts.map(font => font.googleFont).join('&family=');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
    link.rel = 'stylesheet';
    
    // Remove existing Google Fonts link if present
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (existingLink) {
      existingLink.remove();
    }
    
    document.head.appendChild(link);
  };

  const setCurrentFontById = (fontId: string) => {
    const font = FONT_OPTIONS.find(f => f.id === fontId);
    if (font) {
      setCurrentFont(font);
      if (font.googleFont) {
        loadGoogleFonts([font]);
      }
    }
  };

  const setCurrentLanguageByCode = (languageCode: string) => {
    const language = LANGUAGE_OPTIONS.find(l => l.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
    }
  };

  return {
    preferences,
    currentFont,
    currentLanguage,
    entryCustomizations,
    updatePreferences,
    setEntryCustomization,
    getEntryCustomization,
    setCurrentFontById,
    setCurrentLanguageByCode,
    loadGoogleFonts
  };
}