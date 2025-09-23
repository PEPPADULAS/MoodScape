'use client'

import { motion } from 'framer-motion'
import { Achievement } from '@/lib/achievements'

interface AchievementBadgeProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  onClick?: () => void
}

const sizeClasses = {
  sm: 'w-12 h-12 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-24 h-24 text-base'
}

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600'
}

const tierGlows = {
  bronze: 'shadow-amber-500/30',
  silver: 'shadow-gray-500/30',
  gold: 'shadow-yellow-500/30',
  platinum: 'shadow-purple-500/30'
}

export function AchievementBadge({
  achievement,
  isUnlocked,
  progress = 0,
  size = 'md',
  showProgress = false,
  onClick
}: AchievementBadgeProps) {
  const tierColor = tierColors[achievement.tier]
  const tierGlow = tierGlows[achievement.tier]

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} cursor-pointer group`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Badge Container */}
      <div
        className={`
          relative w-full h-full rounded-full border-2 overflow-hidden
          transition-all duration-300 group-hover:scale-105
          ${isUnlocked 
            ? `bg-gradient-to-br ${tierColor} border-white/20 ${tierGlow} shadow-lg` 
            : 'bg-gray-600 border-gray-500 opacity-40'
          }
        `}
      >
        {/* Badge Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${isUnlocked ? 'text-white' : 'text-gray-400'} font-bold`}>
            {achievement.emoji}
          </span>
        </div>

        {/* Unlock Animation Overlay */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
          />
        )}

        {/* Progress Ring (for incomplete achievements) */}
        {!isUnlocked && showProgress && progress > 0 && (
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-700"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-blue-400"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
        )}

        {/* Tier Indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br ${tierColor} border border-white/30 flex items-center justify-center`}>
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap shadow-lg">
          <div className="font-semibold">{achievement.name}</div>
          <div className="text-gray-300">{achievement.description}</div>
          {!isUnlocked && showProgress && (
            <div className="text-blue-300 mt-1">
              Progress: {Math.round(progress * 100)}%
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </motion.div>
  )
}