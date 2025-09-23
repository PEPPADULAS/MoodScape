'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'
import { getCurrentSeason } from '@/lib/utils'

interface SeasonalLoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function SeasonalLoadingAnimation({ 
  size = 'md', 
  className = '',
  text = 'Loading...'
}: SeasonalLoadingAnimationProps) {
  const { theme } = useTheme()
  const season = getCurrentSeason() // Get current season from utils

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  // Spring Animation - Blooming Flower
  const SpringLoader = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Flower petals */}
      {[0, 72, 144, 216, 288].map((rotation, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: rotation }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        >
          <div className="w-3 h-6 bg-gradient-to-t from-pink-400 to-pink-200 rounded-full" />
        </motion.div>
      ))}
      {/* Center */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
      </motion.div>
    </div>
  )

  // Summer Animation - Radiating Sun
  const SummerLoader = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Sun rays */}
      {Array.from({ length: 8 }, (_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: index * 45 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        >
          <div className="w-1 h-6 bg-gradient-to-t from-yellow-400 to-orange-400 rounded-full" />
        </motion.div>
      ))}
      {/* Sun center */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: 360 
        }}
        transition={{ 
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 4, repeat: Infinity, ease: 'linear' }
        }}
      >
        <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg" />
      </motion.div>
    </div>
  )

  // Fall Animation - Falling Leaves
  const FallLoader = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-start justify-center"
          initial={{ y: -20, rotate: 0, opacity: 0 }}
          animate={{ 
            y: [0, 40, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.8,
            ease: 'easeInOut'
          }}
          style={{ left: `${index * 30}%` }}
        >
          <div className={`w-3 h-4 ${
            index === 0 ? 'bg-orange-400' : 
            index === 1 ? 'bg-red-400' : 'bg-yellow-400'
          } rounded-full transform rotate-45`} />
        </motion.div>
      ))}
    </div>
  )

  // Winter Animation - Falling Snowflakes
  const WinterLoader = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-start justify-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ 
            y: [0, 50, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: index * 0.5,
            ease: 'easeInOut'
          }}
          style={{ left: `${index * 20}%` }}
        >
          <div className="w-2 h-2 bg-blue-100 rounded-full shadow-sm" />
        </motion.div>
      ))}
      {/* Snowflake crystals */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 w-0.5 h-4 bg-blue-200 left-1/2 transform -translate-x-1/2" />
          <div className="absolute inset-0 w-4 h-0.5 bg-blue-200 top-1/2 transform -translate-y-1/2" />
          <div className="absolute inset-0 w-0.5 h-4 bg-blue-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute inset-0 w-0.5 h-4 bg-blue-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45" />
        </div>
      </motion.div>
    </div>
  )

  // Rainy Animation - Raindrops
  const RainyLoader = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-start justify-center"
          initial={{ y: -15, opacity: 0 }}
          animate={{ 
            y: [0, 45, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: index * 0.3,
            ease: 'easeIn'
          }}
          style={{ left: `${index * 25}%` }}
        >
          <div className="w-1 h-4 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full" />
        </motion.div>
      ))}
      {/* Cloud */}
      <motion.div 
        className="absolute inset-0 flex items-start justify-center pt-1"
        animate={{ 
          x: [-2, 2, -2],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-8 h-4 bg-gray-300 rounded-full relative">
          <div className="absolute -left-1 top-1 w-3 h-3 bg-gray-300 rounded-full" />
          <div className="absolute -right-1 top-1 w-3 h-3 bg-gray-300 rounded-full" />
        </div>
      </motion.div>
    </div>
  )

  const getSeasonalLoader = () => {
    switch (season) {
      case 'spring':
        return <SpringLoader />
      case 'summer':
        return <SummerLoader />
      case 'fall':
        return <FallLoader />
      case 'winter':
        return <WinterLoader />
      case 'rainy':
        return <RainyLoader />
      default:
        return <SpringLoader />
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {getSeasonalLoader()}
      
      {text && (
        <motion.p
          className={`${textSizes[size]} ${theme.text} font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Specific loading components for different use cases
export function ThoughtLoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <SeasonalLoadingAnimation 
      size="sm" 
      text="Loading thoughts..." 
      className={className}
    />
  )
}

export function PageLoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <SeasonalLoadingAnimation 
      size="lg" 
      text="Getting ready..." 
      className={`min-h-[200px] ${className}`}
    />
  )
}

export function ButtonLoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <SeasonalLoadingAnimation 
      size="sm" 
      className={className}
    />
  )
}