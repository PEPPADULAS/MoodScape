'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { themes, ThemeName, ThemeMode, toggleThemeMode, getThemeBySeasonAndMode } from '@/lib/themes'
import { getCurrentSeason } from '@/lib/utils'

interface ThemeContextType {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
  theme: typeof themes[ThemeName]
  autoTheme: boolean
  setAutoTheme: (auto: boolean) => void
  themeMode: ThemeMode
  toggleMode: () => void
  setThemeMode: (mode: ThemeMode) => void
  customGradient: string | null
  setCustomGradient: (gradient: string | null) => void
  clearCustomGradient: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('spring')
  const [autoTheme, setAutoTheme] = useState(true)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const [customGradient, setCustomGradient] = useState<string | null>(null)

  // Load custom gradient from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGradient = localStorage.getItem('moodscape-custom-gradient')
      if (savedGradient) {
        setCustomGradient(savedGradient)
        // Apply immediately to DOM
        const root = document.documentElement
        root.style.setProperty('background', savedGradient)
        document.body.style.background = savedGradient
      }
    }
  }, [])

  // Ensure custom gradient is always applied when it exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGradient = localStorage.getItem('moodscape-custom-gradient')
      if (savedGradient && !customGradient) {
        setCustomGradient(savedGradient)
        const root = document.documentElement
        root.style.setProperty('background', savedGradient)
        document.body.style.background = savedGradient
      }
    }
  }, [customGradient])

  // Get current theme mode from the theme
  const currentThemeMode = themes[currentTheme].mode

  useEffect(() => {
    // Load user's theme preference or use current season
    if (session?.user) {
      fetchUserTheme()
    } else {
      // For non-authenticated users, use current season with light mode
      const season = getCurrentSeason()
      setCurrentTheme(season as ThemeName)
      setThemeMode('light')
    }
  }, [session?.user?.email]) // Only depend on user email, not the entire session object


  useEffect(() => {
    // Auto-update theme based on season if enabled
    if (autoTheme && !customGradient) {
      // Also check localStorage for custom gradient
      const savedGradient = typeof window !== 'undefined' ? localStorage.getItem('moodscape-custom-gradient') : null
      
      if (!savedGradient) {
        const season = getCurrentSeason()
        const newTheme = getThemeBySeasonAndMode(season, themeMode)
        if (newTheme !== currentTheme) {
          setCurrentTheme(newTheme)
          if (session?.user) {
            updateUserTheme(newTheme, true)
          }
        }
      }
    }
  }, [autoTheme, themeMode, session, customGradient])

  // Apply custom gradient when it changes
  useEffect(() => {
    if (customGradient) {
      const root = document.documentElement
      root.style.setProperty('background', customGradient)
      document.body.style.background = customGradient
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('moodscape-custom-gradient', customGradient)
      }
    } else {
      // Clear from localStorage when gradient is removed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('moodscape-custom-gradient')
      }
    }
  }, [customGradient])

  const fetchUserTheme = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const settings = await response.json()
        const userTheme = settings.currentTheme || getCurrentSeason()
        const userMode = settings.themeMode || 'light'
        
        // Check if there's a saved custom gradient in localStorage
        const savedGradient = typeof window !== 'undefined' ? localStorage.getItem('moodscape-custom-gradient') : null
        
        // Only update theme if no custom gradient is active (either in state or localStorage)
        if (!customGradient && !savedGradient) {
          setCurrentTheme(userTheme)
          setThemeMode(userMode)
        }
        setAutoTheme(settings.autoTheme ?? true)
      }
    } catch (error) {
      console.error('Failed to fetch user theme:', error)
    }
  }

  const updateUserTheme = async (theme: ThemeName, auto?: boolean, mode?: ThemeMode) => {
    try {
      await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentTheme: theme,
          ...(auto !== undefined && { autoTheme: auto }),
          ...(mode !== undefined && { themeMode: mode })
        }),
      })
    } catch (error) {
      console.error('Failed to update user theme:', error)
    }
  }

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme)
    const newMode = themes[theme].mode
    setThemeMode(newMode)
    // Clear custom gradient when switching to regular theme
    if (customGradient) {
      setCustomGradient(null)
      const root = document.documentElement
      root.style.removeProperty('background')
      document.body.style.removeProperty('background')
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('moodscape-custom-gradient')
      }
    }
    if (session?.user) {
      updateUserTheme(theme, undefined, newMode)
    }
  }

  const toggleMode = () => {
    const newTheme = toggleThemeMode(currentTheme)
    setCurrentTheme(newTheme)
    const newMode = themes[newTheme].mode
    setThemeMode(newMode)
    if (session?.user) {
      updateUserTheme(newTheme, undefined, newMode)
    }
  }

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode)
    // Update theme to match the new mode
    if (autoTheme) {
      const season = getCurrentSeason()
      const newTheme = getThemeBySeasonAndMode(season, mode)
      setCurrentTheme(newTheme)
      if (session?.user) {
        updateUserTheme(newTheme, undefined, mode)
      }
    } else {
      const newTheme = toggleThemeMode(currentTheme)
      if (themes[newTheme].mode === mode) {
        setCurrentTheme(newTheme)
        if (session?.user) {
          updateUserTheme(newTheme, undefined, mode)
        }
      }
    }
  }

  const handleAutoTheme = (auto: boolean) => {
    setAutoTheme(auto)
    if (session?.user) {
      updateUserTheme(currentTheme, auto)
    }
    if (auto) {
      const season = getCurrentSeason()
      const newTheme = getThemeBySeasonAndMode(season, themeMode)
      setTheme(newTheme)
    }
  }

  const clearCustomGradient = () => {
    setCustomGradient(null)
    // Reset to default theme background
    const root = document.documentElement
    root.style.removeProperty('background')
    document.body.style.removeProperty('background')
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('moodscape-custom-gradient')
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        theme: themes[currentTheme],
        autoTheme,
        setAutoTheme: handleAutoTheme,
        themeMode: currentThemeMode,
        toggleMode,
        setThemeMode: handleSetThemeMode,
        customGradient,
        setCustomGradient,
        clearCustomGradient,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}