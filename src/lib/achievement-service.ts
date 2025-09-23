import { Achievement, ACHIEVEMENTS, UserStats, UserStreak } from './achievements'

export class AchievementService {
  static checkAchievements(userStats: UserStats, newThought?: any): Achievement[] {
    const newlyUnlocked: Achievement[] = []
    const unlockedIds = new Set(userStats.achievements.map(a => a.id))

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.has(achievement.id)) continue

      let isUnlocked = false
      let progress = 0

      switch (achievement.id) {
        // Writing milestones
        case 'first-thought':
          isUnlocked = userStats.totalThoughts >= 1
          progress = Math.min(userStats.totalThoughts, 1)
          break
        case 'thoughts-10':
          isUnlocked = userStats.totalThoughts >= 10
          progress = Math.min(userStats.totalThoughts, 10)
          break
        case 'thoughts-50':
          isUnlocked = userStats.totalThoughts >= 50
          progress = Math.min(userStats.totalThoughts, 50)
          break
        case 'thoughts-100':
          isUnlocked = userStats.totalThoughts >= 100
          progress = Math.min(userStats.totalThoughts, 100)
          break
        case 'thoughts-500':
          isUnlocked = userStats.totalThoughts >= 500
          progress = Math.min(userStats.totalThoughts, 500)
          break

        // Streak achievements
        case 'streak-3':
          isUnlocked = userStats.streaks.current >= 3 || userStats.streaks.longest >= 3
          progress = Math.max(userStats.streaks.current, userStats.streaks.longest)
          break
        case 'streak-7':
          isUnlocked = userStats.streaks.current >= 7 || userStats.streaks.longest >= 7
          progress = Math.max(userStats.streaks.current, userStats.streaks.longest)
          break
        case 'streak-30':
          isUnlocked = userStats.streaks.current >= 30 || userStats.streaks.longest >= 30
          progress = Math.max(userStats.streaks.current, userStats.streaks.longest)
          break
        case 'streak-100':
          isUnlocked = userStats.streaks.current >= 100 || userStats.streaks.longest >= 100
          progress = Math.max(userStats.streaks.current, userStats.streaks.longest)
          break

        // Mood achievements
        case 'mood-explorer':
          const uniqueMoods = Object.keys(userStats.moodEntries).length
          isUnlocked = uniqueMoods >= 5
          progress = Math.min(uniqueMoods, 5)
          break
        case 'emotional-range':
          const allMoods = Object.keys(userStats.moodEntries).length
          isUnlocked = allMoods >= 8
          progress = Math.min(allMoods, 8)
          break
        case 'happy-thoughts':
          const happyCount = userStats.moodEntries.happy || 0
          isUnlocked = happyCount >= 20
          progress = Math.min(happyCount, 20)
          break
        case 'grateful-heart':
          const gratefulCount = userStats.moodEntries.grateful || 0
          isUnlocked = gratefulCount >= 15
          progress = Math.min(gratefulCount, 15)
          break

        // Seasonal achievements
        case 'seasonal-explorer':
          const uniqueSeasons = Object.keys(userStats.seasonalThoughts).length
          isUnlocked = uniqueSeasons >= 5
          progress = Math.min(uniqueSeasons, 5)
          break
        case 'spring-bloom':
          const springCount = userStats.seasonalThoughts.spring || 0
          isUnlocked = springCount >= 10
          progress = Math.min(springCount, 10)
          break
        case 'summer-vibes':
          const summerCount = userStats.seasonalThoughts.summer || 0
          isUnlocked = summerCount >= 10
          progress = Math.min(summerCount, 10)
          break
        case 'autumn-reflection':
          const fallCount = userStats.seasonalThoughts.fall || 0
          isUnlocked = fallCount >= 10
          progress = Math.min(fallCount, 10)
          break
        case 'winter-wisdom':
          const winterCount = userStats.seasonalThoughts.winter || 0
          isUnlocked = winterCount >= 10
          progress = Math.min(winterCount, 10)
          break
        case 'rainy-day-poet':
          const rainyCount = userStats.seasonalThoughts.rainy || 0
          isUnlocked = rainyCount >= 10
          progress = Math.min(rainyCount, 10)
          break

        // Special achievements
        case 'early-bird':
          if (newThought) {
            const thoughtTime = new Date(newThought.createdAt)
            isUnlocked = thoughtTime.getHours() < 6
          }
          break
        case 'night-owl':
          if (newThought) {
            const thoughtTime = new Date(newThought.createdAt)
            isUnlocked = thoughtTime.getHours() >= 23
          }
          break
        case 'wordsmith':
          isUnlocked = userStats.totalWords >= 1000
          progress = Math.min(userStats.totalWords, 1000)
          break
        case 'novelist':
          isUnlocked = userStats.totalWords >= 10000
          progress = Math.min(userStats.totalWords, 10000)
          break
      }

      if (isUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date(),
          progress: achievement.requirement
        }
        newlyUnlocked.push(unlockedAchievement)
      } else if (progress > 0) {
        // Update progress for tracking
        achievement.progress = progress
      }
    }

    return newlyUnlocked
  }

  static calculateStreak(thoughts: Array<{ createdAt: string }>): UserStreak {
    if (thoughts.length === 0) {
      return { current: 0, longest: 0 }
    }

    // Sort thoughts by date
    const sortedThoughts = thoughts
      .map(t => new Date(t.createdAt))
      .sort((a, b) => b.getTime() - a.getTime())

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Get unique days
    const uniqueDays = [...new Set(sortedThoughts.map(date => {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    }))].sort((a, b) => b - a)

    if (uniqueDays.length === 0) {
      return { current: 0, longest: 0 }
    }

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    const latestDay = new Date(uniqueDays[0])
    
    // Check if streak is still active (today or yesterday)
    if (latestDay.getTime() === today.getTime() || latestDay.getTime() === yesterday.getTime()) {
      currentStreak = 1
      
      // Calculate current streak
      for (let i = 1; i < uniqueDays.length; i++) {
        const currentDay = new Date(uniqueDays[i])
        const previousDay = new Date(uniqueDays[i - 1])
        const dayDiff = Math.floor((previousDay.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24))
        
        if (dayDiff === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1
    for (let i = 1; i < uniqueDays.length; i++) {
      const currentDay = new Date(uniqueDays[i])
      const previousDay = new Date(uniqueDays[i - 1])
      const dayDiff = Math.floor((previousDay.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dayDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak)

    return {
      current: currentStreak,
      longest: longestStreak,
      lastEntryDate: sortedThoughts[0]
    }
  }

  static calculateUserStats(thoughts: any[], achievements: Achievement[]): UserStats {
    const totalThoughts = thoughts.length
    const totalWords = thoughts.reduce((sum, thought) => {
      return sum + (thought.content?.split(' ').length || 0) + (thought.title?.split(' ').length || 0)
    }, 0)

    const moodEntries: Record<string, number> = {}
    const seasonalThoughts: Record<string, number> = {}

    thoughts.forEach(thought => {
      if (thought.mood) {
        moodEntries[thought.mood] = (moodEntries[thought.mood] || 0) + 1
      }
      if (thought.season) {
        seasonalThoughts[thought.season] = (seasonalThoughts[thought.season] || 0) + 1
      }
    })

    const streaks = this.calculateStreak(thoughts)

    return {
      totalThoughts,
      totalWords,
      moodEntries,
      seasonalThoughts,
      streaks,
      achievements,
      joinedDate: thoughts.length > 0 ? new Date(thoughts[thoughts.length - 1].createdAt) : new Date()
    }
  }
}