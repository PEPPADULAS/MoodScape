'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { themes, ThemeName, getSeasonalThemes } from '@/lib/themes'

export default function ThemeSelector() {
  const { currentTheme, setTheme, autoTheme, setAutoTheme, themeMode, toggleMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const lightThemes = getSeasonalThemes('light')
  const darkThemes = getSeasonalThemes('dark')
  const utilityThemes: ThemeName[] = ['light', 'dark']

  // Theme-aware styling
  const buttonClasses = themeMode === 'light'
    ? 'bg-white/95 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-gray-400 text-gray-900 shadow-sm hover:shadow-md'
    : 'bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:border-white/40 text-white shadow-lg'
  
  const dropdownClasses = themeMode === 'light'
    ? 'bg-white backdrop-blur-sm border-gray-300 shadow-xl'
    : 'bg-gray-800/98 backdrop-blur-sm border-gray-600 shadow-2xl'
  
  const textClasses = themeMode === 'light'
    ? 'text-gray-900'
    : 'text-white'
  
  const secondaryTextClasses = themeMode === 'light'
    ? 'text-gray-700'
    : 'text-gray-200'
  
  const labelTextClasses = themeMode === 'light'
    ? 'text-gray-500'
    : 'text-gray-400'
  
  const hoverClasses = themeMode === 'light'
    ? 'hover:bg-gray-100/80'
    : 'hover:bg-gray-700/50'
  
  const selectedClasses = themeMode === 'light'
    ? 'bg-gray-100/90 border-l-2 border-l-blue-500'
    : 'bg-gray-700/60 border-l-2 border-l-blue-400'
  
  const modeToggleClasses = themeMode === 'light'
    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
    : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
  
  const borderClasses = themeMode === 'light'
    ? 'border-gray-200'
    : 'border-gray-600'

  // Function to get theme-specific styling for the selector
  const getThemeOptionClasses = (themeName: ThemeName) => {
    if (themeMode === 'light') {
      switch (themeName) {
        case 'spring':
          return 'hover:bg-emerald-50/80 border-emerald-100'
        case 'summer':
          return 'hover:bg-amber-50/80 border-amber-100'
        case 'fall':
          return 'hover:bg-orange-50/80 border-orange-100'
        case 'winter':
          return 'hover:bg-sky-50/80 border-sky-100'
        case 'rainy':
          return 'hover:bg-slate-50/80 border-slate-100'
        default:
          return 'hover:bg-gray-100/80 border-gray-100'
      }
    } else {
      return hoverClasses
    }
  }

  // Function to get selected theme-specific styling
  const getSelectedThemeOptionClasses = (themeName: ThemeName) => {
    if (themeMode === 'light') {
      switch (themeName) {
        case 'spring':
          return 'bg-emerald-50/90 border-l-2 border-l-emerald-500'
        case 'summer':
          return 'bg-amber-50/90 border-l-2 border-l-amber-500'
        case 'fall':
          return 'bg-orange-50/90 border-l-2 border-l-orange-500'
        case 'winter':
          return 'bg-sky-50/90 border-l-2 border-l-sky-500'
        case 'rainy':
          return 'bg-slate-50/90 border-l-2 border-l-slate-500'
        default:
          return 'bg-gray-100/90 border-l-2 border-l-blue-500'
      }
    } else {
      return selectedClasses
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${buttonClasses}`}
      >
        <span className="text-2xl">{themes[currentTheme].emoji}</span>
        <span className={`text-sm font-medium ${textClasses}`}>{themes[currentTheme].name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${textClasses}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full mt-2 left-0 w-64 rounded-lg border z-50 ${dropdownClasses}`}
          >
            <div className="p-2 space-y-3">
              {/* Mode Toggle */}
              <div className={`px-3 py-2 border-b ${borderClasses}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${textClasses}`}>Theme Mode</span>
                  <button
                    onClick={toggleMode}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${modeToggleClasses}`}
                  >
                    {themeMode === 'light' ? (
                      <>
                        <Sun className="w-3 h-3" />
                        <span className="text-xs">Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3 h-3" />
                        <span className="text-xs">Dark</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Auto Season Toggle */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoTheme}
                    onChange={(e) => setAutoTheme(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${secondaryTextClasses}`}>Auto Season</span>
                </label>
              </div>
              
              {/* Seasonal Themes */}
              <div>
                <div className="px-3 py-1">
                  <span className={`text-xs font-medium uppercase tracking-wide ${labelTextClasses}`}>
                    Seasonal Themes
                  </span>
                </div>
                <div className="space-y-1">
                  {(themeMode === 'light' ? lightThemes : darkThemes).map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => {
                        setTheme(themeName)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        currentTheme === themeName 
                          ? getSelectedThemeOptionClasses(themeName) 
                          : getThemeOptionClasses(themeName)
                      }`}
                    >
                      <span className="text-lg">{themes[themeName].emoji}</span>
                      <span className={`text-sm flex-1 text-left ${textClasses}`}>{themes[themeName].name}</span>
                      {currentTheme === themeName && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pure Light/Dark Themes */}
              <div>
                <div className="px-3 py-1">
                  <span className={`text-xs font-medium uppercase tracking-wide ${labelTextClasses}`}>
                    Basic Themes
                  </span>
                </div>
                <div className="space-y-1">
                  {utilityThemes.map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => {
                        setTheme(themeName)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${hoverClasses} ${
                        currentTheme === themeName ? selectedClasses : ''
                      }`}
                    >
                      <span className="text-lg">{themes[themeName].emoji}</span>
                      <span className={`text-sm flex-1 text-left ${textClasses}`}>{themes[themeName].name}</span>
                      {currentTheme === themeName && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}