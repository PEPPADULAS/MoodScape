'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Calendar, Heart, TrendingUp, Trophy, PieChart, Type } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import MoodTimeline from './charts/mood-timeline'
import { WordCloud } from './charts/word-cloud'
import { InteractiveCharts } from './charts/interactive-charts'
import { AchievementGrid } from './achievements/achievement-grid'
import { AchievementCelebration } from './achievements/achievement-celebration'
import { Achievement } from '@/lib/achievements'
import { LoadingWrapper, AnalyticsSkeleton } from './loading/loading-wrapper'

interface Analytics {
  totalThoughts: number
  recentThoughts: number
  thoughtsBySeason: Record<string, number>
  thoughtsByMood: Record<string, number>
  monthlyStats: Record<string, number>
  thoughts: Array<{
    id: string
    title?: string
    content: string
    mood?: string
    season?: string
    tags?: string
    createdAt: string
  }>
}

interface AchievementData {
  userStats: any
  unlockedAchievements: string[]
  achievementProgress: Record<string, number>
}

export default function AnalyticsDashboard() {
  const { theme } = useTheme()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [achievements, setAchievements] = useState<AchievementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [achievementsLoading, setAchievementsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'insights' | 'achievements' | 'charts'>('insights')
  const [celebrationAchievement, setCelebrationAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    fetchAnalytics()
    fetchAchievements()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/thoughts/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAchievements = async () => {
    try {
      // For now, using a placeholder user ID. In a real app, this would come from auth
      const response = await fetch('/api/achievements?userId=user-placeholder')
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
    } finally {
      setAchievementsLoading(false)
    }
  }

  const getSeasonEmoji = (season: string) => {
    switch (season) {
      case 'spring': return '🌸'
      case 'summer': return '☀️'
      case 'fall': return '🍂'
      case 'winter': return '❄️'
      case 'rainy': return '🌧️'
      default: return '🌟'
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'excited': return '🤩'
      case 'calm': return '😌'
      case 'anxious': return '😰'
      case 'grateful': return '🙏'
      default: return '💭'
    }
  }

  if (loading || achievementsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.card} rounded-xl p-6 mb-8`}
      >
        <AnalyticsSkeleton />
      </motion.div>
    )
  }

  if (!analytics) {
    return null
  }

  const topSeason = Object.entries(analytics.thoughtsBySeason).reduce(
    (a, b) => a[1] > b[1] ? a : b,
    ['', 0]
  )

  const topMood = Object.entries(analytics.thoughtsByMood).reduce(
    (a, b) => a[1] > b[1] ? a : b,
    ['', 0]
  )

  const handleAchievementClick = (achievement: Achievement) => {
    setCelebrationAchievement(achievement)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.card} rounded-xl p-6 mb-8`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className={`w-5 h-5 ${theme.text}`} />
          <h3 className={`text-lg font-semibold ${theme.text}`}>Your Journal Analytics</h3>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'insights'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            📊 Insights
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'charts'
                ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            📈 Charts
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'achievements'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🏆 Achievements
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'insights' ? (
        <>
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.text} mb-1`}>
                {analytics.totalThoughts}
              </div>
              <div className={`text-sm ${theme.accent}`}>Total Thoughts</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.text} mb-1`}>
                {analytics.recentThoughts}
              </div>
              <div className={`text-sm ${theme.accent}`}>This Week</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-1">
                {getSeasonEmoji(topSeason[0])}
              </div>
              <div className={`text-sm ${theme.accent}`}>
                Favorite Season
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-1">
                {getMoodEmoji(topMood[0])}
              </div>
              <div className={`text-sm ${theme.accent}`}>
                Common Mood
              </div>
            </div>
          </div>

          {/* Seasonal Distribution */}
          {Object.keys(analytics.thoughtsBySeason).length > 0 && (
            <div className="mb-6">
              <h4 className={`text-sm font-medium ${theme.text} mb-3`}>
                Thoughts by Season
              </h4>
              <div className="space-y-2">
                {Object.entries(analytics.thoughtsBySeason).map(([season, count]) => {
                  const percentage = (count / analytics.totalThoughts) * 100
                  return (
                    <div key={season} className="flex items-center space-x-3">
                      <span className="text-lg">{getSeasonEmoji(season)}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className={theme.text}>{season.charAt(0).toUpperCase() + season.slice(1)}</span>
                          <span className={theme.accent}>{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`bg-gradient-to-r ${theme.primary} h-2 rounded-full`}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Mood Distribution */}
          {Object.keys(analytics.thoughtsByMood).length > 0 && (
            <div>
              <h4 className={`text-sm font-medium ${theme.text} mb-3`}>
                Emotional Patterns
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(analytics.thoughtsByMood).map(([mood, count]) => (
                  <div
                    key={mood}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="text-xl mb-1">{getMoodEmoji(mood)}</div>
                    <div className={`text-sm font-medium ${theme.text}`}>
                      {count}
                    </div>
                    <div className={`text-xs ${theme.accent} capitalize`}>
                      {mood}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Timeline Chart */}
          <MoodTimeline className="mt-6" />
        </>
      ) : activeTab === 'charts' ? (
        /* Interactive Charts Tab */
        <div className="space-y-8">
          <InteractiveCharts thoughts={analytics.thoughts} />
          <WordCloud thoughts={analytics.thoughts} />
        </div>
      ) : (
        /* Achievement Tab */
        achievements && (
          <AchievementGrid
            unlockedAchievements={achievements.unlockedAchievements}
            achievementProgress={achievements.achievementProgress}
            onAchievementClick={handleAchievementClick}
          />
        )
      )}

      {/* Achievement Celebration Modal */}
      <AchievementCelebration
        achievement={celebrationAchievement}
        onClose={() => setCelebrationAchievement(null)}
      />
    </motion.div>
  )
}