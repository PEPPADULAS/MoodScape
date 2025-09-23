export type VisualPackId =
  | 'spring-blossom'
  | 'summer-neon'
  | 'autumn-vintage'
  | 'winter-aurora'
  | 'rainy-ink'

export interface VisualPack {
  id: VisualPackId
  name: string
  description: string
  gradient: string // tailwind classes for background accents
  fontPrimary?: string // from getFontClass keys
  fontSecondary?: string
  stickers?: Array<{ emoji: string; size: number; opacity?: number }>
  unlockRule: { achievementIds?: string[]; minStreak?: number }
}

export const VISUAL_PACKS: VisualPack[] = [
  {
    id: 'spring-blossom',
    name: 'Spring Blossom',
    description: 'Petals, soft gradients, and handwritten accents.',
    gradient: 'from-pink-300/20 via-rose-200/10 to-emerald-200/20',
    fontPrimary: 'playfair',
    fontSecondary: 'dancing-script',
    stickers: [{ emoji: '🌸', size: 18, opacity: 0.8 }],
    unlockRule: { achievementIds: ['spring-bloom'] }
  },
  {
    id: 'summer-neon',
    name: 'Summer Neon',
    description: 'Vibrant neon glow with bold sans.',
    gradient: 'from-yellow-300/20 via-orange-300/10 to-fuchsia-300/20',
    fontPrimary: 'poppins',
    stickers: [{ emoji: '☀️', size: 18, opacity: 0.85 }],
    unlockRule: { achievementIds: ['summer-vibes'] }
  },
  {
    id: 'autumn-vintage',
    name: 'Autumn Vintage',
    description: 'Warm film grain and serif textures.',
    gradient: 'from-amber-300/20 via-orange-200/10 to-rose-200/20',
    fontPrimary: 'merriweather',
    stickers: [{ emoji: '🍂', size: 18, opacity: 0.8 }],
    unlockRule: { achievementIds: ['autumn-reflection'] }
  },
  {
    id: 'winter-aurora',
    name: 'Winter Aurora',
    description: 'Icy glow with aurora accents.',
    gradient: 'from-sky-300/20 via-cyan-200/10 to-indigo-300/20',
    fontPrimary: 'inter',
    stickers: [{ emoji: '❄️', size: 18, opacity: 0.8 }],
    unlockRule: { achievementIds: ['winter-wisdom'] }
  },
  {
    id: 'rainy-ink',
    name: 'Rainy Ink',
    description: 'Typewriter grain with raindrop flourishes.',
    gradient: 'from-slate-300/20 via-blue-200/10 to-slate-200/20',
    fontPrimary: 'special-elite',
    stickers: [{ emoji: '🌧️', size: 18, opacity: 0.8 }],
    unlockRule: { achievementIds: ['rainy-day-poet'] }
  }
]

export function isPackUnlocked(pack: VisualPack, unlockedAchievementIds: string[], longestStreak: number): boolean {
  const aRule = pack.unlockRule.achievementIds
  if (aRule && aRule.length > 0) {
    return aRule.every(id => unlockedAchievementIds.includes(id))
  }
  if (pack.unlockRule.minStreak) {
    return longestStreak >= pack.unlockRule.minStreak
  }
  return false
}


