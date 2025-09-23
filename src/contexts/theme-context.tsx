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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('spring')
  const [autoTheme, setAutoTheme] = useState(true)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

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
  }, [session])

  useEffect(() => {
    // Auto-update theme based on season if enabled
    if (autoTheme) {
      const season = getCurrentSeason()
      const newTheme = getThemeBySeasonAndMode(season, themeMode)
      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme)
        if (session?.user) {
          updateUserTheme(newTheme, true)
        }
      }
    }
  }, [autoTheme, themeMode, session])

  const fetchUserTheme = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const settings = await response.json()
        const userTheme = settings.currentTheme || getCurrentSeason()
        const userMode = settings.themeMode || 'light'
        
        setCurrentTheme(userTheme)
        setThemeMode(userMode)
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