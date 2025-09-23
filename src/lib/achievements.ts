export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  type: 'streak' | 'milestone' | 'seasonal' | 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  requirement: number
  category: 'writing' | 'mood' | 'exploration' | 'consistency'
  unlockedAt?: Date
  progress?: number
}

export interface UserStreak {
  current: number
  longest: number
  lastEntryDate?: Date
}

export interface UserStats {
  totalThoughts: number
  streaks: UserStreak
  achievements: Achievement[]
  totalWords: number
  moodEntries: Record<string, number>
  seasonalThoughts: Record<string, number>
  joinedDate: Date
}

export const ACHIEVEMENTS: Achievement[] = [
  // Writing Milestones
  {
    id: 'first-thought',
    name: 'First Steps',
    description: 'Share your very first thought',
    emoji: '👶',
    type: 'milestone',
    tier: 'bronze',
    requirement: 1,
    category: 'writing'
  },
  {
    id: 'thoughts-10',
    name: 'Getting Started',
    description: 'Write 10 thoughts',
    emoji: '📝',
    type: 'milestone',
    tier: 'bronze',
    requirement: 10,
    category: 'writing'
  },
  {
    id: 'thoughts-50',
    name: 'Thoughtful Writer',
    description: 'Write 50 thoughts',
    emoji: '✍️',
    type: 'milestone',
    tier: 'silver',
    requirement: 50,
    category: 'writing'
  },
  {
    id: 'thoughts-100',
    name: 'Prolific Author',
    description: 'Write 100 thoughts',
    emoji: '📚',
    type: 'milestone',
    tier: 'gold',
    requirement: 100,
    category: 'writing'
  },
  {
    id: 'thoughts-500',
    name: 'Master Storyteller',
    description: 'Write 500 thoughts',
    emoji: '🏆',
    type: 'milestone',
    tier: 'platinum',
    requirement: 500,
    category: 'writing'
  },

  // Streak Achievements
  {
    id: 'streak-3',
    name: 'Building Momentum',
    description: 'Write for 3 consecutive days',
    emoji: '🔥',
    type: 'streak',
    tier: 'bronze',
    requirement: 3,
    category: 'consistency'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Write for 7 consecutive days',
    emoji: '🔥',
    type: 'streak',
    tier: 'silver',
    requirement: 7,
    category: 'consistency'
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Write for 30 consecutive days',
    emoji: '🔥',
    type: 'streak',
    tier: 'gold',
    requirement: 30,
    category: 'consistency'
  },
  {
    id: 'streak-100',
    name: 'Centurion',
    description: 'Write for 100 consecutive days',
    emoji: '🔥',
    type: 'streak',
    tier: 'platinum',
    requirement: 100,
    category: 'consistency'
  },

  // Mood Achievements
  {
    id: 'mood-explorer',
    name: 'Mood Explorer',
    description: 'Record 5 different moods',
    emoji: '🎭',
    type: 'milestone',
    tier: 'bronze',
    requirement: 5,
    category: 'mood'
  },
  {
    id: 'emotional-range',
    name: 'Emotional Range',
    description: 'Record all 8 different moods',
    emoji: '🌈',
    type: 'milestone',
    tier: 'gold',
    requirement: 8,
    category: 'mood'
  },
  {
    id: 'happy-thoughts',
    name: 'Sunshine Spirit',
    description: 'Record 20 happy thoughts',
    emoji: '😊',
    type: 'milestone',
    tier: 'silver',
    requirement: 20,
    category: 'mood'
  },
  {
    id: 'grateful-heart',
    name: 'Grateful Heart',
    description: 'Record 15 grateful thoughts',
    emoji: '🙏',
    type: 'milestone',
    tier: 'silver',
    requirement: 15,
    category: 'mood'
  },

  // Seasonal Achievements
  {
    id: 'seasonal-explorer',
    name: 'Seasonal Explorer',
    description: 'Write thoughts in all 5 seasons',
    emoji: '🌎',
    type: 'seasonal',
    tier: 'gold',
    requirement: 5,
    category: 'exploration'
  },
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    description: 'Write 10 thoughts in spring',
    emoji: '🌸',
    type: 'seasonal',
    tier: 'bronze',
    requirement: 10,
    category: 'exploration'
  },
  {
    id: 'summer-vibes',
    name: 'Summer Vibes',
    description: 'Write 10 thoughts in summer',
    emoji: '☀️',
    type: 'seasonal',
    tier: 'bronze',
    requirement: 10,
    category: 'exploration'
  },
  {
    id: 'autumn-reflection',
    name: 'Autumn Reflection',
    description: 'Write 10 thoughts in fall',
    emoji: '🍂',
    type: 'seasonal',
    tier: 'bronze',
    requirement: 10,
    category: 'exploration'
  },
  {
    id: 'winter-wisdom',
    name: 'Winter Wisdom',
    description: 'Write 10 thoughts in winter',
    emoji: '❄️',
    type: 'seasonal',
    tier: 'bronze',
    requirement: 10,
    category: 'exploration'
  },
  {
    id: 'rainy-day-poet',
    name: 'Rainy Day Poet',
    description: 'Write 10 thoughts on rainy days',
    emoji: '🌧️',
    type: 'seasonal',
    tier: 'bronze',
    requirement: 10,
    category: 'exploration'
  },

  // Special Achievements
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Write a thought before 6 AM',
    emoji: '🌅',
    type: 'special',
    tier: 'silver',
    requirement: 1,
    category: 'writing'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Write a thought after 11 PM',
    emoji: '🦉',
    type: 'special',
    tier: 'silver',
    requirement: 1,
    category: 'writing'
  },
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Write 1000 total words',
    emoji: '📖',
    type: 'milestone',
    tier: 'silver',
    requirement: 1000,
    category: 'writing'
  },
  {
    id: 'novelist',
    name: 'Novelist',
    description: 'Write 10,000 total words',
    emoji: '📚',
    type: 'milestone',
    tier: 'platinum',
    requirement: 10000,
    category: 'writing'
  }
]

export const getTierColor = (tier: Achievement['tier']) => {
  switch (tier) {
    case 'bronze': return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' }
    case 'silver': return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
    case 'gold': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' }
    case 'platinum': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' }
  }
}

export const getCategoryIcon = (category: Achievement['category']) => {
  switch (category) {
    case 'writing': return '✍️'
    case 'mood': return '🎭'
    case 'exploration': return '🌍'
    case 'consistency': return '📅'
  }
}