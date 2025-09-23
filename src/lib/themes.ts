export const themes = {
  // Light Themes
  spring: {
    name: 'Spring',
    mode: 'light' as const,
    primary: 'from-green-400 to-blue-500',
    secondary: 'from-pink-300 to-purple-400',
    background: 'bg-gradient-to-br from-green-50 to-blue-50',
    card: 'bg-white/80 backdrop-blur-sm border-green-200',
    text: 'text-green-900',
    accent: 'text-green-600',
    button: 'bg-green-500 hover:bg-green-600',
    emoji: '🌸'
  },
  summer: {
    name: 'Summer',
    mode: 'light' as const,
    primary: 'from-yellow-400 to-orange-500',
    secondary: 'from-red-300 to-pink-400',
    background: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    card: 'bg-white/80 backdrop-blur-sm border-orange-200',
    text: 'text-orange-900',
    accent: 'text-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600',
    emoji: '☀️'
  },
  fall: {
    name: 'Fall',
    mode: 'light' as const,
    primary: 'from-orange-500 to-red-600',
    secondary: 'from-yellow-400 to-orange-500',
    background: 'bg-gradient-to-br from-orange-50 to-red-50',
    card: 'bg-white/80 backdrop-blur-sm border-orange-300',
    text: 'text-orange-900',
    accent: 'text-red-600',
    button: 'bg-red-500 hover:bg-red-600',
    emoji: '🍂'
  },
  winter: {
    name: 'Winter',
    mode: 'light' as const,
    primary: 'from-blue-400 to-purple-600',
    secondary: 'from-indigo-300 to-blue-400',
    background: 'bg-gradient-to-br from-blue-50 to-purple-50',
    card: 'bg-white/80 backdrop-blur-sm border-blue-200',
    text: 'text-blue-900',
    accent: 'text-blue-600',
    button: 'bg-blue-500 hover:bg-blue-600',
    emoji: '❄️'
  },
  rainy: {
    name: 'Rainy',
    mode: 'light' as const,
    primary: 'from-slate-400 to-blue-600',
    secondary: 'from-gray-300 to-slate-400',
    background: 'bg-gradient-to-br from-slate-50 to-gray-100',
    card: 'bg-white/80 backdrop-blur-sm border-slate-300',
    text: 'text-slate-900',
    accent: 'text-slate-600',
    button: 'bg-slate-500 hover:bg-slate-600',
    emoji: '🌧️'
  },
  // Dark Themes
  'spring-dark': {
    name: 'Spring Dark',
    mode: 'dark' as const,
    primary: 'from-green-400 to-blue-500',
    secondary: 'from-pink-400 to-purple-500',
    background: 'bg-gradient-to-br from-gray-900 via-green-900/20 to-blue-900/20',
    card: 'bg-gray-800/80 backdrop-blur-sm border-green-700/30',
    text: 'text-green-100',
    accent: 'text-green-400',
    button: 'bg-green-600 hover:bg-green-500',
    emoji: '🌸'
  },
  'summer-dark': {
    name: 'Summer Dark',
    mode: 'dark' as const,
    primary: 'from-yellow-500 to-orange-600',
    secondary: 'from-red-400 to-pink-500',
    background: 'bg-gradient-to-br from-gray-900 via-yellow-900/20 to-orange-900/20',
    card: 'bg-gray-800/80 backdrop-blur-sm border-orange-700/30',
    text: 'text-orange-100',
    accent: 'text-orange-400',
    button: 'bg-orange-600 hover:bg-orange-500',
    emoji: '☀️'
  },
  'fall-dark': {
    name: 'Fall Dark',
    mode: 'dark' as const,
    primary: 'from-orange-600 to-red-700',
    secondary: 'from-yellow-500 to-orange-600',
    background: 'bg-gradient-to-br from-gray-900 via-orange-900/20 to-red-900/20',
    card: 'bg-gray-800/80 backdrop-blur-sm border-orange-700/30',
    text: 'text-orange-100',
    accent: 'text-red-400',
    button: 'bg-red-600 hover:bg-red-500',
    emoji: '🍂'
  },
  'winter-dark': {
    name: 'Winter Dark',
    mode: 'dark' as const,
    primary: 'from-blue-500 to-purple-700',
    secondary: 'from-indigo-400 to-blue-500',
    background: 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20',
    card: 'bg-gray-800/80 backdrop-blur-sm border-blue-700/30',
    text: 'text-blue-100',
    accent: 'text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-500',
    emoji: '❄️'
  },
  'rainy-dark': {
    name: 'Rainy Dark',
    mode: 'dark' as const,
    primary: 'from-slate-500 to-blue-700',
    secondary: 'from-gray-600 to-slate-500',
    background: 'bg-gradient-to-br from-gray-900 via-slate-900/30 to-gray-800',
    card: 'bg-gray-800/80 backdrop-blur-sm border-slate-600/30',
    text: 'text-slate-100',
    accent: 'text-slate-400',
    button: 'bg-slate-600 hover:bg-slate-500',
    emoji: '🌧️'
  },
  // Pure Light/Dark Themes
  light: {
    name: 'Light',
    mode: 'light' as const,
    primary: 'from-blue-500 to-purple-600',
    secondary: 'from-gray-200 to-gray-300',
    background: 'bg-gradient-to-br from-gray-50 to-white',
    card: 'bg-white/90 backdrop-blur-sm border-gray-200',
    text: 'text-gray-900',
    accent: 'text-gray-600',
    button: 'bg-blue-600 hover:bg-blue-700',
    emoji: '☀️'
  },
  dark: {
    name: 'Dark',
    mode: 'dark' as const,
    primary: 'from-blue-400 to-purple-500',
    secondary: 'from-gray-700 to-gray-800',
    background: 'bg-gradient-to-br from-gray-900 to-black',
    card: 'bg-gray-800/90 backdrop-blur-sm border-gray-700',
    text: 'text-gray-100',
    accent: 'text-gray-400',
    button: 'bg-blue-600 hover:bg-blue-500',
    emoji: '🌙'
  }
} as const

export type ThemeName = keyof typeof themes
export type ThemeMode = 'light' | 'dark'

// Helper function to get seasonal themes
export const getSeasonalThemes = (mode: ThemeMode): ThemeName[] => {
  if (mode === 'light') {
    return ['spring', 'summer', 'fall', 'winter', 'rainy']
  }
  return ['spring-dark', 'summer-dark', 'fall-dark', 'winter-dark', 'rainy-dark']
}

// Helper function to get theme by season and mode
export const getThemeBySeasonAndMode = (season: string, mode: ThemeMode): ThemeName => {
  if (mode === 'dark') {
    return `${season}-dark` as ThemeName
  }
  return season as ThemeName
}

// Helper function to toggle between light and dark mode of the same season
export const toggleThemeMode = (currentTheme: ThemeName): ThemeName => {
  const theme = themes[currentTheme]
  
  if (theme.mode === 'light') {
    // Switch to dark mode
    if (currentTheme === 'light') return 'dark'
    if (currentTheme === 'rainy') return 'rainy-dark'
    return `${currentTheme}-dark` as ThemeName
  } else {
    // Switch to light mode
    if (currentTheme === 'dark') return 'light'
    if (currentTheme === 'rainy-dark') return 'rainy'
    return currentTheme.replace('-dark', '') as ThemeName
  }
}