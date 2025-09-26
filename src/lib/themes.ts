export const themes = {
  // Light Themes
  spring: {
    name: 'Spring',
    mode: 'light' as const,
    primary: 'from-emerald-400 to-cyan-500',
    secondary: 'from-pink-400 to-purple-500',
    background: 'bg-gradient-to-br from-emerald-50 via-cyan-50 to-green-50',
    card: 'bg-white/90 backdrop-blur-sm border-emerald-200 shadow-emerald-100/50',
    text: 'text-emerald-900',
    accent: 'text-emerald-600',
    button: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white',
    emoji: '🌸'
  },
  summer: {
    name: 'Summer',
    mode: 'light' as const,
    primary: 'from-amber-400 to-orange-500',
    secondary: 'from-red-400 to-pink-500',
    background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    card: 'bg-white/90 backdrop-blur-sm border-amber-200 shadow-amber-100/50',
    text: 'text-amber-900',
    accent: 'text-amber-600',
    button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
    emoji: '☀️'
  },
  fall: {
    name: 'Fall',
    mode: 'light' as const,
    primary: 'from-orange-500 to-red-600',
    secondary: 'from-amber-400 to-orange-500',
    background: 'bg-gradient-to-br from-orange-50 via-red-50 to-amber-50',
    card: 'bg-white/90 backdrop-blur-sm border-orange-300 shadow-orange-100/50',
    text: 'text-orange-900',
    accent: 'text-red-600',
    button: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white',
    emoji: '🍂'
  },
  winter: {
    name: 'Winter',
    mode: 'light' as const,
    primary: 'from-sky-400 to-indigo-600',
    secondary: 'from-blue-400 to-indigo-500',
    background: 'bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-50',
    card: 'bg-white/90 backdrop-blur-sm border-sky-200 shadow-sky-100/50',
    text: 'text-sky-900',
    accent: 'text-sky-600',
    button: 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white',
    emoji: '❄️'
  },
  rainy: {
    name: 'Rainy',
    mode: 'light' as const,
    primary: 'from-slate-500 to-blue-600',
    secondary: 'from-gray-400 to-slate-500',
    background: 'bg-gradient-to-br from-slate-100 via-blue-50 to-gray-100',
    card: 'bg-white/90 backdrop-blur-sm border-slate-300 shadow-slate-200/50',
    text: 'text-slate-900',
    accent: 'text-slate-600',
    button: 'bg-gradient-to-r from-slate-500 to-blue-600 hover:from-slate-600 hover:to-blue-700 text-white',
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