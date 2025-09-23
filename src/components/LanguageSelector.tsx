import React, { useState } from 'react';
import { Globe, ChevronDown, Search, X } from 'lucide-react';
import { LanguageOption } from '../types/customization';
import { LANGUAGE_OPTIONS } from '../data/languages';

interface LanguageSelectorProps {
  selectedLanguage: LanguageOption;
  onLanguageChange: (language: LanguageOption) => void;
  className?: string;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = LANGUAGE_OPTIONS.filter(language =>
    language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    language.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    language.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: LanguageOption) => {
    onLanguageChange(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-lg mr-1">{selectedLanguage.flag}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {selectedLanguage.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.map(language => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                  selectedLanguage.code === language.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                dir={language.direction}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {language.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language.nativeName}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 uppercase">
                    {language.code}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No languages found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}