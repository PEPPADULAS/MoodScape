import React, { useState } from 'react';
import { Type, ChevronDown, Search, X } from 'lucide-react';
import { FontOption } from '../types/customization';
import { FONT_OPTIONS, FONT_CATEGORIES } from '../data/fonts';

interface FontSelectorProps {
  selectedFont: FontOption;
  onFontChange: (font: FontOption) => void;
  className?: string;
}

export function FontSelector({ selectedFont, onFontChange, className = '' }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFonts = FONT_OPTIONS.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         font.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFontSelect = (font: FontOption) => {
    onFontChange(font);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {selectedFont.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search fonts..."
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

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {FONT_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredFonts.map(font => (
              <button
                key={font.id}
                onClick={() => handleFontSelect(font)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                  selectedFont.id === font.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {font.name}
                    </div>
                    <div 
                      className="text-sm text-gray-600 dark:text-gray-400"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.preview}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 capitalize">
                    {font.category.replace('-', ' ')}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filteredFonts.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No fonts found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}