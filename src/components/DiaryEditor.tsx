import React, { useState, useEffect } from 'react';
import { Type, Globe, Settings, Save, Calendar } from 'lucide-react';
import { FontSelector } from './FontSelector';
import { LanguageSelector } from './LanguageSelector';
import { CustomizationPanel } from './CustomizationPanel';
import { useCustomization } from '../hooks/useCustomization';
import { FONT_OPTIONS } from '../data/fonts';
import { LANGUAGE_OPTIONS } from '../data/languages';

interface DiaryEditorProps {
  entryId?: string;
  initialContent?: string;
  onSave?: (content: string, customization: any) => void;
  className?: string;
}

export function DiaryEditor({ 
  entryId = 'temp-entry', 
  initialContent = '', 
  onSave,
  className = '' 
}: DiaryEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [showCustomization, setShowCustomization] = useState(false);
  const [currentCustomization, setCurrentCustomization] = useState<any>(null);
  
  const {
    preferences,
    currentFont,
    currentLanguage,
    getEntryCustomization,
    setCurrentFontById,
    setCurrentLanguageByCode,
    loadGoogleFonts
  } = useCustomization();

  // Load entry-specific customization
  useEffect(() => {
    if (entryId && preferences.perEntryCustomization) {
      const customization = getEntryCustomization(entryId);
      setCurrentCustomization(customization);
      setCurrentFontById(customization.fontId);
      setCurrentLanguageByCode(customization.languageCode);
      
      // Load Google Fonts if needed
      const font = FONT_OPTIONS.find(f => f.id === customization.fontId);
      if (font?.googleFont) {
        loadGoogleFonts([font]);
      }
    }
  }, [entryId, preferences.perEntryCustomization]);

  const handleQuickFontChange = (font: any) => {
    setCurrentFontById(font.id);
    if (font.googleFont) {
      loadGoogleFonts([font]);
    }
  };

  const handleQuickLanguageChange = (language: any) => {
    setCurrentLanguageByCode(language.code);
  };

  const handleCustomizationChange = (customization: any) => {
    setCurrentCustomization(customization);
    setCurrentFontById(customization.fontId);
    setCurrentLanguageByCode(customization.languageCode);
    
    // Load Google Fonts if needed
    const font = FONT_OPTIONS.find(f => f.id === customization.fontId);
    if (font?.googleFont) {
      loadGoogleFonts([font]);
    }
  };

  const handleSave = () => {
    const customization = preferences.perEntryCustomization 
      ? currentCustomization || getEntryCustomization(entryId)
      : {
          fontId: preferences.defaultFont,
          languageCode: preferences.defaultLanguage,
          fontSize: 16,
          lineHeight: 1.6
        };
    
    onSave?.(content, customization);
  };

  const editorStyle = {
    fontFamily: currentFont?.fontFamily || 'Inter, sans-serif',
    fontSize: currentCustomization?.fontSize || 16,
    lineHeight: currentCustomization?.lineHeight || 1.6,
    direction: currentLanguage?.direction || 'ltr'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString(currentLanguage?.code || 'en', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Font Selector */}
          <FontSelector
            selectedFont={currentFont || FONT_OPTIONS[0]}
            onFontChange={handleQuickFontChange}
          />

          {/* Quick Language Selector */}
          <LanguageSelector
            selectedLanguage={currentLanguage || LANGUAGE_OPTIONS[0]}
            onLanguageChange={handleQuickLanguageChange}
          />

          {/* Advanced Customization */}
          <button
            onClick={() => setShowCustomization(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Advanced customization"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Start writing your thoughts in ${currentLanguage?.name || 'English'}...`}
          className="w-full h-96 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          style={editorStyle}
          dir={currentLanguage?.direction || 'ltr'}
        />
      </div>

      {/* Word Count */}
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

      {/* Customization Panel */}
      <CustomizationPanel
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        entryId={entryId}
        onCustomizationChange={handleCustomizationChange}
      />
    </div>
  );
}