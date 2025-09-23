'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Achievement } from '@/lib/achievements'

interface AchievementCelebrationProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementCelebration({ achievement, onClose }: AchievementCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 500) // Wait for exit animation
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const tierColors = {
    bronze: 'from-amber-400 to-amber-600',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-purple-600'
  }

  const tierGlow = {
    bronze: 'shadow-amber-500/50',
    silver: 'shadow-gray-500/50',
    gold: 'shadow-yellow-500/50',
    platinum: 'shadow-purple-500/50'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 500)
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Achievement Card */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    y: [0, -20, 40]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', damping: 15 }}
              >
                🎉
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Achievement Unlocked!
              </motion.h2>

              <motion.div
                className="text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                You've earned a new badge
              </motion.div>
            </div>

            {/* Achievement Badge */}
            <motion.div
              className="flex flex-col items-center mb-6"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: 'spring', damping: 12 }}
            >
              {/* Large Badge */}
              <div className={`
                relative w-24 h-24 rounded-full mb-4
                bg-gradient-to-br ${tierColors[achievement.tier]}
                ${tierGlow[achievement.tier]} shadow-lg
                flex items-center justify-center
                border-4 border-white/20
              `}>
                <span className="text-4xl text-white">{achievement.emoji}</span>
                
                {/* Animated Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/40"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Achievement Details */}
              <motion.h3
                className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {achievement.name}
              </motion.h3>

              <motion.p
                className="text-gray-600 dark:text-gray-400 text-center text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                {achievement.description}
              </motion.p>

              {/* Tier Badge */}
              <motion.div
                className={`
                  mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                  bg-gradient-to-r ${tierColors[achievement.tier]} text-white
                  shadow-sm
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                {achievement.tier}
              </motion.div>
            </motion.div>

            {/* Close Button */}
            <motion.button
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 500)
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Awesome! 🚀
            </motion.button>

            {/* Progress Indicator */}
            <motion.div
              className="absolute top-2 right-2 w-1 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div
                className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-full"
                initial={{ height: '100%' }}
                animate={{ height: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}