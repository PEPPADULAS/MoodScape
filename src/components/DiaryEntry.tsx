import React, { useState } from 'react';
import { Edit3, Globe, Type, Calendar, Clock } from 'lucide-react';
import { useCustomization } from '../hooks/useCustomization';
import { FONT_OPTIONS } from '../data/fonts';
import { LANGUAGE_OPTIONS } from '../data/languages';

interface DiaryEntryProps {
  id: string;
  content: string;
  date: Date;
  customization?: any;
  onEdit?: () => void;
  className?: string;
}

export function DiaryEntry({ 
  id, 
  content, 
  date, 
  customization,
  onEdit,
  className = '' 
}: DiaryEntryProps) {
  const { loadGoogleFonts } = useCustomization();
  
  // Get font and language details
  const font = FONT_OPTIONS.find(f => f.id === customization?.fontId) || FONT_OPTIONS[0];
  const language = LANGUAGE_OPTIONS.find(l => l.code === customization?.languageCode) || LANGUAGE_OPTIONS[0];

  // Load Google Font if needed
  React.useEffect(() => {
    if (font?.googleFont) {
      loadGoogleFonts([font]);
    }
  }, [font]);

  const entryStyle = {
    fontFamily: font.fontFamily,
    fontSize: customization?.fontSize || 16,
    lineHeight: customization?.lineHeight || 1.6,
    direction: language.direction
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {date.toLocaleDateString(language.code, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="text-xs">
              {date.toLocaleTimeString(language.code, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Font and Language Indicators */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Type className="w-3 h-3" />
              <span>{font.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span className="text-sm">{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </div>

          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Edit entry"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div 
          className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap"
          style={entryStyle}
          dir={language.direction}
        >
          {content}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {content.split(/\s+/).filter(word => word.length > 0).length} words
          </span>
          <span>
            {content.length} characters
          </span>
        </div>
      </div>
    </div>
  );
}