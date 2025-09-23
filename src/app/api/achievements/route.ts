import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AchievementService } from '@/lib/achievement-service'
import { ACHIEVEMENTS } from '@/lib/achievements'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's thoughts and stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        thoughts: {
          select: {
            id: true,
            content: true,
            mood: true,
            season: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate user statistics
    const totalThoughts = user.thoughts.length
    const totalWords = user.thoughts.reduce((sum, thought) => 
      sum + thought.content.split(' ').length, 0
    )
    
    const moodEntries: Record<string, number> = {}
    const seasonalThoughts: Record<string, number> = {}
    
    user.thoughts.forEach(thought => {
      if (thought.mood) {
        moodEntries[thought.mood] = (moodEntries[thought.mood] || 0) + 1
      }
      if (thought.season) {
        seasonalThoughts[thought.season] = (seasonalThoughts[thought.season] || 0) + 1
      }
    })

    // Calculate streaks
    const sortedThoughts = user.thoughts
      .map(t => new Date(t.createdAt))
      .sort((a, b) => b.getTime() - a.getTime())
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1
    
    if (sortedThoughts.length > 0) {
      const today = new Date()
      const lastThought = sortedThoughts[0]
      const diffDays = Math.floor((today.getTime() - lastThought.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 1) {
        currentStreak = 1
        
        for (let i = 1; i < sortedThoughts.length; i++) {
          const prevDate = sortedThoughts[i - 1]
          const currDate = sortedThoughts[i]
          const dayDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (dayDiff === 1) {
            tempStreak++
            currentStreak = tempStreak
          } else {
            longestStreak = Math.max(longestStreak, tempStreak)
            tempStreak = 1
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak)
    }

    const userStats = {
      totalThoughts,
      totalWords,
      moodEntries,
      seasonalThoughts,
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        lastEntryDate: sortedThoughts[0] || null
      },
      achievements: [], // Start with empty achievements array
      joinedDate: user.createdAt
    }

    // Check unlocked achievements
    const unlockedAchievements = AchievementService.checkAchievements(userStats)
    const unlockedIds = unlockedAchievements.map(a => a.id)
    
    // Calculate progress for all achievements
    const achievementProgress: Record<string, number> = {}
    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedIds.includes(achievement.id)) {
        // Calculate progress based on achievement type
        let progress = 0
        switch (achievement.id) {
          case 'first-thought':
          case 'thoughts-10':
          case 'thoughts-50':
          case 'thoughts-100':
          case 'thoughts-500':
            progress = Math.min(userStats.totalThoughts / achievement.requirement, 1)
            break
          case 'streak-3':
          case 'streak-7':
          case 'streak-30':
          case 'streak-100':
            progress = Math.min(Math.max(userStats.streaks.current, userStats.streaks.longest) / achievement.requirement, 1)
            break
          case 'wordsmith':
          case 'novelist':
            progress = Math.min(userStats.totalWords / achievement.requirement, 1)
            break
          case 'mood-explorer':
            progress = Math.min(Object.keys(userStats.moodEntries).length / 5, 1)
            break
          case 'emotional-range':
            progress = Math.min(Object.keys(userStats.moodEntries).length / 8, 1)
            break
          case 'seasonal-explorer':
            progress = Math.min(Object.keys(userStats.seasonalThoughts).length / 5, 1)
            break
        }
        if (progress > 0) {
          achievementProgress[achievement.id] = progress
        }
      }
    })

    return NextResponse.json({
      userStats,
      unlockedAchievements,
      achievementProgress
    })

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}