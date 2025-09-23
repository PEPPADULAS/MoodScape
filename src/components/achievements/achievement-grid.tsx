'use client'

import { motion } from 'framer-motion'
import { Achievement, ACHIEVEMENTS } from '@/lib/achievements'
import { AchievementBadge } from './achievement-badge'

interface AchievementGridProps {
  unlockedAchievements: string[]
  achievementProgress: Record<string, number>
  onAchievementClick?: (achievement: Achievement) => void
}

const categoryLabels: Record<Achievement['type'], string> = {
  milestone: '🎯 Milestones',
  streak: '🔥 Streaks',
  seasonal: '🌸 Seasonal',
  special: '⭐ Special'
}

const categoryDescriptions: Record<Achievement['type'], string> = {
  milestone: 'Achievements for reaching writing milestones',
  streak: 'Achievements for maintaining consistent writing habits',
  seasonal: 'Achievements for exploring different seasons and moods',
  special: 'Rare and unique achievements for special accomplishments'
}

export function AchievementGrid({ 
  unlockedAchievements, 
  achievementProgress, 
  onAchievementClick 
}: AchievementGridProps) {
  const categorizedAchievements = ACHIEVEMENTS.reduce((acc, achievement) => {
    if (!acc[achievement.type]) {
      acc[achievement.type] = []
    }
    acc[achievement.type].push(achievement)
    return acc
  }, {} as Record<Achievement['type'], Achievement[]>)

  const totalAchievements = ACHIEVEMENTS.length
  const unlockedCount = unlockedAchievements.length
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100)

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🏆 Achievements
          </h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {unlockedCount}/{totalAchievements}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {completionPercentage}% Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </motion.div>

      {/* Achievement Categories */}
      {Object.entries(categorizedAchievements).map(([category, categoryAchievements], categoryIndex) => {
        const categoryUnlocked = categoryAchievements.filter(achievement => 
          unlockedAchievements.includes(achievement.id)
        ).length

        return (
          <motion.div
            key={category}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {categoryLabels[category as Achievement['type']]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {categoryDescriptions[category as Achievement['type']]}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {categoryUnlocked}/{categoryAchievements.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((categoryUnlocked / categoryAchievements.length) * 100)}%
                </div>
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {categoryAchievements.map((achievement, index) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id)
                const progress = achievementProgress[achievement.id] || 0

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: categoryIndex * 0.1 + index * 0.05 
                    }}
                  >
                    <AchievementBadge
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                      progress={progress}
                      size="md"
                      showProgress={true}
                      onClick={() => onAchievementClick?.(achievement)}
                    />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}

      {/* Achievement Tips */}
      <motion.div
        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">
          💡 Tips for Unlocking Achievements
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-700 dark:text-amber-300">
          <div>
            <strong>Daily Writing:</strong> Write regularly to unlock streak achievements and maintain your momentum.
          </div>
          <div>
            <strong>Explore Seasons:</strong> Write thoughts in different seasons to discover seasonal achievements.
          </div>
          <div>
            <strong>Express Emotions:</strong> Try writing about different moods to unlock emotional milestones.
          </div>
          <div>
            <strong>Stay Consistent:</strong> Some achievements require sustained effort over time.
          </div>
        </div>
      </motion.div>
    </div>
  )
}