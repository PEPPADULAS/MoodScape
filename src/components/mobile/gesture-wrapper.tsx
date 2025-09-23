'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'

interface MobileGestureWrapperProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPullToRefresh?: () => void
  enablePullToRefresh?: boolean
  className?: string
}

export function MobileGestureWrapper({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPullToRefresh,
  enablePullToRefresh = false,
  className = ''
}: MobileGestureWrapperProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 100], [1, 0.5])
  const scale = useTransform(y, [0, 100], [1, 0.95])

  const handlePan = (event: PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = 50
    const velocityThreshold = 300

    // Determine swipe direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > swipeThreshold && velocity.x > velocityThreshold) {
        onSwipeRight?.()
        triggerHapticFeedback('light')
      } else if (offset.x < -swipeThreshold && velocity.x < -velocityThreshold) {
        onSwipeLeft?.()
        triggerHapticFeedback('light')
      }
    } else {
      // Vertical swipe
      if (offset.y > swipeThreshold && velocity.y > velocityThreshold) {
        onSwipeDown?.()
        triggerHapticFeedback('light')
      } else if (offset.y < -swipeThreshold && velocity.y < -velocityThreshold) {
        onSwipeUp?.()
        triggerHapticFeedback('light')
      }
    }
  }

  const handlePullToRefresh = async (event: PointerEvent, info: PanInfo) => {
    if (!enablePullToRefresh || !onPullToRefresh) return

    const { offset } = info
    const pullThreshold = 120

    if (offset.y > pullThreshold) {
      setIsRefreshing(true)
      triggerHapticFeedback('medium')
      
      try {
        await onPullToRefresh()
      } finally {
        setIsRefreshing(false)
        y.set(0)
      }
    }
  }

  const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[intensity])
    }
  }

  return (
    <motion.div
      className={className}
      style={{ 
        y: enablePullToRefresh ? y : undefined,
        opacity: enablePullToRefresh ? opacity : undefined,
        scale: enablePullToRefresh ? scale : undefined
      }}
      onPan={enablePullToRefresh ? handlePullToRefresh : handlePan}
      onPanEnd={(event, info) => {
        if (enablePullToRefresh) {
          handlePullToRefresh(event, info)
        } else {
          handlePan(event, info)
        }
      }}
      drag={enablePullToRefresh ? 'y' : false}
      dragConstraints={enablePullToRefresh ? { top: 0, bottom: 120 } : undefined}
      dragElastic={enablePullToRefresh ? 0.3 : undefined}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ 
            opacity: useTransform(y, [0, 50, 100], [0, 0.5, 1]).get(),
            y: useTransform(y, [0, 100], [-50, 0]).get()
          }}
        >
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            {isRefreshing ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-sm">Refreshing...</span>
              </>
            ) : (
              <>
                <motion.div
                  className="w-4 h-4"
                  animate={{ rotate: useTransform(y, [0, 100], [0, 180]).get() }}
                >
                  ↓
                </motion.div>
                <span className="text-sm">Pull to refresh</span>
              </>
            )}
          </div>
        </motion.div>
      )}
      
      {children}
    </motion.div>
  )
}

// Touch feedback component for buttons and interactive elements
interface TouchFeedbackProps {
  children: React.ReactNode
  onPress?: () => void
  hapticFeedback?: 'light' | 'medium' | 'heavy'
  className?: string
  disabled?: boolean
}

export function TouchFeedback({ 
  children, 
  onPress, 
  hapticFeedback = 'light',
  className = '',
  disabled = false
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false)

  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[hapticFeedback])
    }
  }

  const handlePress = () => {
    if (disabled) return
    
    setIsPressed(true)
    triggerHapticFeedback()
    onPress?.()
    
    setTimeout(() => setIsPressed(false), 150)
  }

  return (
    <motion.div
      className={className}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onTap={handlePress}
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

// Swipe navigation component for cards/items
interface SwipeNavigationProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon: React.ReactNode
    color: string
    label: string
  }
  rightAction?: {
    icon: React.ReactNode
    color: string
    label: string
  }
  className?: string
}

export function SwipeNavigation({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className = ''
}: SwipeNavigationProps) {
  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)

  const leftActionOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0])
  const rightActionOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1])

  const handleDragEnd = (event: PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = 100
    const velocityThreshold = 200

    setIsDragging(false)

    if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      onSwipeRight?.()
      if ('vibrate' in navigator) navigator.vibrate([20])
    } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      onSwipeLeft?.()
      if ('vibrate' in navigator) navigator.vibrate([20])
    }

    x.set(0)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left action background */}
      {leftAction && (
        <motion.div
          className={`absolute left-0 top-0 bottom-0 flex items-center justify-start pl-4 ${leftAction.color}`}
          style={{ opacity: leftActionOpacity }}
        >
          <div className="flex items-center space-x-2 text-white">
            {leftAction.icon}
            <span className="text-sm font-medium">{leftAction.label}</span>
          </div>
        </motion.div>
      )}

      {/* Right action background */}
      {rightAction && (
        <motion.div
          className={`absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4 ${rightAction.color}`}
          style={{ opacity: rightActionOpacity }}
        >
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className={`relative z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {children}
      </motion.div>
    </div>
  )
}