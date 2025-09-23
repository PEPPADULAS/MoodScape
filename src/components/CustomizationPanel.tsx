import React from 'react';
import { Settings, Palette, Type, Globe, Save, RotateCcw } from 'lucide-react';
import { FontSelector } from './FontSelector';
import { LanguageSelector } from './LanguageSelector';
import { useCustomization } from '../hooks/useCustomization';
import { FONT_OPTIONS } from '../data/fonts';
import { LANGUAGE_OPTIONS } from '../data/languages';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onCustomizationChange?: (customization: any) => void;
}

export function CustomizationPanel({ 
  isOpen, 
  onClose, 
  entryId, 
  onCustomizationChange 
}: CustomizationPanelProps) {
  const {
    preferences,
    currentFont,
    currentLanguage,
    updatePreferences,
    setEntryCustomization,
    getEntryCustomization,
    setCurrentFontById,
    setCurrentLanguageByCode
  } = useCustomization();

  const entryCustomization = entryId ? getEntryCustomization(entryId) : null;

  const handleFontChange = (font: any) => {
    if (entryId && preferences.perEntryCustomization) {
      const customization = {
        ...getEntryCustomization(entryId),
        fontId: font.id
      };
      setEntryCustomization(entryId, customization);
      onCustomizationChange?.(customization);
    } else {
      updatePreferences({ defaultFont: font.id });
    }
    setCurrentFontById(font.id);
  };

  const handleLanguageChange = (language: any) => {
    if (entryId && preferences.perEntryCustomization) {
      const customization = {
        ...getEntryCustomization(entryId),
        languageCode: language.code
      };
      setEntryCustomization(entryId, customization);
      onCustomizationChange?.(customization);
    } else {
      updatePreferences({ defaultLanguage: language.code });
    }
    setCurrentLanguageByCode(language.code);
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (entryId && preferences.perEntryCustomization) {
      const customization = {
        ...getEntryCustomization(entryId),
        fontSize
      };
      setEntryCustomization(entryId, customization);
      onCustomizationChange?.(customization);
    }
  };

  const handleLineHeightChange = (lineHeight: number) => {
    if (entryId && preferences.perEntryCustomization) {
      const customization = {
        ...getEntryCustomization(entryId),
        lineHeight
      };
      setEntryCustomization(entryId, customization);
      onCustomizationChange?.(customization);
    }
  };

  const resetToDefaults = () => {
    if (entryId && preferences.perEntryCustomization) {
      const defaultCustomization = {
        fontId: preferences.defaultFont,
        languageCode: preferences.defaultLanguage,
        fontSize: 16,
        lineHeight: 1.6
      };
      setEntryCustomization(entryId, defaultCustomization);
      onCustomizationChange?.(defaultCustomization);
      setCurrentFontById(preferences.defaultFont);
      setCurrentLanguageByCode(preferences.defaultLanguage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Customization
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {entryId && preferences.perEntryCustomization 
                  ? 'Customize this entry' 
                  : 'Set your default preferences'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Global Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Preferences
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Per-entry customization
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Allow different fonts and languages for each entry
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.perEntryCustomization}
                  onChange={(e) => updatePreferences({ perEntryCustomization: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Font Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Font Style
            </h3>
            
            <FontSelector
              selectedFont={currentFont || FONT_OPTIONS[0]}
              onFontChange={handleFontChange}
              className="w-full"
            />

            {/* Font Size and Line Height */}
            {entryId && preferences.perEntryCustomization && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={entryCustomization?.fontSize || 16}
                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {entryCustomization?.fontSize || 16}px
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Line Height
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.1"
                    value={entryCustomization?.lineHeight || 1.6}
                    onChange={(e) => handleLineHeightChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {entryCustomization?.lineHeight || 1.6}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language
            </h3>
            
            <LanguageSelector
              selectedLanguage={currentLanguage || LANGUAGE_OPTIONS[0]}
              onLanguageChange={handleLanguageChange}
              className="w-full"
            />
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Preview
            </h3>
            
            <div 
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
              style={{
                fontFamily: currentFont?.fontFamily,
                fontSize: entryCustomization?.fontSize || 16,
                lineHeight: entryCustomization?.lineHeight || 1.6,
                direction: currentLanguage?.direction || 'ltr'
              }}
            >
              <div className="text-gray-900 dark:text-gray-100">
                {currentLanguage?.code === 'hi' && 'आज मैंने एक सुंदर सूर्यास्त देखा। यह वास्तव में अद्भुत था।'}
                {currentLanguage?.code === 'bn' && 'আজ আমি একটি সুন্দর সূর্যাস্ত দেখেছি। এটি সত্যিই অসাধারণ ছিল।'}
                {currentLanguage?.code === 'ar' && 'اليوم رأيت غروب شمس جميل. كان رائعاً حقاً.'}
                {currentLanguage?.code === 'ja' && '今日は美しい夕日を見ました。本当に素晴らしかったです。'}
                {currentLanguage?.code === 'ko' && '오늘 아름다운 일몰을 보았습니다. 정말 멋있었습니다.'}
                {currentLanguage?.code === 'zh' && '今天我看到了美丽的日落。真的很棒。'}
                {!['hi', 'bn', 'ar', 'ja', 'ko', 'zh'].includes(currentLanguage?.code || '') && 
                  'Today I saw a beautiful sunset. It was truly amazing. The colors painted across the sky reminded me of a watercolor masterpiece.'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          {entryId && preferences.perEntryCustomization && (
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to defaults
            </button>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}