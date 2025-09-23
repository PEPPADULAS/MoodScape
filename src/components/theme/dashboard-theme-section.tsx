'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Sparkles, Clock, Cloud, Save, Trash2, Eye } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

interface CustomGradient {
  id: string
  name: string
  colors: string[]
  direction: number
  type: 'linear' | 'radial' | 'conic'
}

interface SavedThemeItem {
  id: string
  gradient: CustomGradient
}

export function DashboardThemeSection() {
  const { theme, setCustomGradient } = useTheme()
  const [customGradients, setCustomGradients] = useState<SavedThemeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  // Load saved custom gradients from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/themes/custom')
        if (res.ok) {
          const items = await res.json()
          const parsed = items.map((it: any) => {
            try {
              const g = JSON.parse(it.data)
              if (!g || !Array.isArray(g.colors)) return null
              return { id: it.id as string, gradient: g as CustomGradient }
            } catch { return null }
          }).filter(Boolean)
          setCustomGradients(parsed as SavedThemeItem[])
        }
      } catch (error) {
        console.error('Failed to load custom gradients:', error)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Listen for new gradient saves
    const handleGradientSaved = (event: CustomEvent) => {
      const newGradient = event.detail
      setCustomGradients(prev => [...prev, newGradient])
    }

    window.addEventListener('customGradientSaved', handleGradientSaved as EventListener)
    
    return () => {
      window.removeEventListener('customGradientSaved', handleGradientSaved as EventListener)
    }
  }, [])

  const generateGradientCSS = (gradient: CustomGradient | null | undefined) => {
    if (!gradient || !Array.isArray(gradient.colors) || gradient.colors.length === 0) {
      return 'linear-gradient(135deg, #667eea, #764ba2)'
    }
    const colorStops = gradient.colors.join(', ')
    
    switch (gradient.type) {
      case 'linear':
        return `linear-gradient(${gradient.direction}deg, ${colorStops})`
      case 'radial':
        return `radial-gradient(circle, ${colorStops})`
      case 'conic':
        return `conic-gradient(from ${gradient.direction}deg, ${colorStops})`
      default:
        return `linear-gradient(${gradient.direction}deg, ${colorStops})`
    }
  }

  const applyGradientTheme = (gradient: CustomGradient) => {
    const gradientCss = generateGradientCSS(gradient)
    
    // Update theme context to persist across page navigation
    setCustomGradient(gradientCss)
  }

  const deleteCustomTheme = async (id: string) => {
    try {
      const res = await fetch(`/api/themes/custom/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCustomGradients(prev => prev.filter(g => g.id !== id))
      } else {
        console.error('Failed to delete custom theme')
      }
    } catch (error) {
      console.error('Error deleting custom theme:', error)
    }
  }

  const displayedGradients = showAll ? customGradients : customGradients.slice(0, 3)

  if (loading) {
    return (
      <div className={`${theme.card} rounded-xl p-6 shadow-lg`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`${theme.card} rounded-xl p-6 shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme.mode === 'light' ? 'bg-purple-100' : 'bg-purple-900/30'}`}>
            <Palette className={`w-6 h-6 ${theme.mode === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme.text}`}>Custom Themes</h3>
            <p className={`text-sm ${theme.accent}`}>Your personalized gradient themes</p>
          </div>
        </div>
        <motion.button
          onClick={() => setShowAll(!showAll)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            theme.mode === 'light'
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-white/10 hover:bg-white/20 text-white/80'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showAll ? 'Show Less' : `Show All (${customGradients.length})`}
        </motion.button>
      </div>

      {customGradients.length === 0 ? (
        <div className="text-center py-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.mode === 'light' ? 'bg-gray-100' : 'bg-white/10'} flex items-center justify-center`}>
            <Sparkles className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h4 className={`text-lg font-semibold ${theme.text} mb-2`}>No Custom Themes Yet</h4>
          <p className={`${theme.accent} mb-4`}>Create your first custom gradient theme using the Theme Studio</p>
          <motion.button
            onClick={() => {
              // Find and click the theme studio toggle button
              const themeStudioButton = document.querySelector('[data-theme-studio-toggle]') as HTMLButtonElement
              if (themeStudioButton) {
                themeStudioButton.click()
              }
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              theme.mode === 'light'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500/40 hover:bg-purple-500/60 text-purple-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Theme Studio
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {displayedGradients.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className={`relative group rounded-lg overflow-hidden ${
                  theme.mode === 'light' ? 'bg-white border border-gray-200' : 'bg-white/5'
                }`}
              >
                {/* Gradient Preview */}
                <div
                  className="h-24 w-full"
                  style={{ background: generateGradientCSS(item.gradient) }}
                />
                
                {/* Content */}
                <div className="p-4">
                  <h4 className={`font-semibold ${theme.text} mb-1 truncate`}>
                    {item.gradient?.name || 'Unnamed Gradient'}
                  </h4>
                  <p className={`text-xs ${theme.accent} mb-3`}>
                    {item.gradient?.type || 'linear'} gradient
                  </p>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => applyGradientTheme(item.gradient)}
                      className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-all duration-200 ${
                        theme.mode === 'light'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500/40 hover:bg-blue-500/60 text-blue-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Apply
                    </motion.button>
                    <motion.button
                      onClick={() => deleteCustomTheme(item.id)}
                      className={`px-3 py-2 rounded text-xs font-medium transition-all duration-200 ${
                        theme.mode === 'light'
                          ? 'bg-red-100 hover:bg-red-200 text-red-700'
                          : 'bg-red-500/20 hover:bg-red-500/40 text-red-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Quick Theme Suggestions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
        <h4 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
          <Clock className="w-5 h-5" />
          Quick Theme Suggestions
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Sunrise', colors: ['#FF6B6B', '#FFE66D'], time: '6-9 AM' },
            { name: 'Daylight', colors: ['#4ECDC4', '#44A08D'], time: '9-17 PM' },
            { name: 'Sunset', colors: ['#FF8A80', '#FF7043'], time: '17-20 PM' },
            { name: 'Night', colors: ['#667eea', '#764ba2'], time: '20-6 AM' }
          ].map((suggestion, index) => (
            <motion.button
              key={suggestion.name}
              onClick={() => {
                const gradient = {
                  id: `suggestion-${index}`,
                  name: suggestion.name,
                  colors: suggestion.colors,
                  direction: 135,
                  type: 'linear' as const
                }
                applyGradientTheme(gradient)
              }}
              className={`p-3 rounded-lg text-left transition-all duration-200 ${
                theme.mode === 'light'
                  ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ background: `linear-gradient(135deg, ${suggestion.colors.join(', ')})` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-white font-semibold text-sm">{suggestion.name}</div>
              <div className="text-white/80 text-xs">{suggestion.time}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
