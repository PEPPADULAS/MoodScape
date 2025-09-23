'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

interface MagneticProps {
  children: React.ReactNode
  intensity?: number
  className?: string
  disabled?: boolean
}

export function Magnetic({ 
  children, 
  intensity = 0.3, 
  className = '',
  disabled = false 
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    if (disabled) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      )
      
      const maxDistance = 150
      const strength = Math.max(0, 1 - distance / maxDistance)
      
      if (strength > 0) {
        const deltaX = (e.clientX - centerX) * intensity * strength
        const deltaY = (e.clientY - centerY) * intensity * strength
        
        x.set(deltaX)
        y.set(deltaY)
      }
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    document.addEventListener('mousemove', handleMouseMove)
    if (ref.current) {
      ref.current.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (ref.current) {
        ref.current.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [x, y, intensity, disabled])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Smooth reveal animation for text
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function TextReveal({ 
  children, 
  className = '', 
  delay = 0, 
  staggerDelay = 0.05 
}: TextRevealProps) {
  const words = children.split(' ')

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * staggerDelay,
            ease: [0.23, 1, 0.32, 1]
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

// Floating animation for elements
interface FloatingProps {
  children: React.ReactNode
  duration?: number
  intensity?: number
  className?: string
}

export function Floating({ 
  children, 
  duration = 3, 
  intensity = 10, 
  className = '' 
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -intensity, 0],
        rotate: [0, 2, 0, -2, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Glowing effect component
interface GlowEffectProps {
  children: React.ReactNode
  color?: string
  intensity?: number
  className?: string
}

export function GlowEffect({ 
  children, 
  color = 'rgba(59, 130, 246, 0.5)', 
  intensity = 20, 
  className = '' 
}: GlowEffectProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered 
          ? `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`
          : 'none'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Morphing shape component
interface MorphingShapeProps {
  className?: string
  color?: string
  size?: number
}

export function MorphingShape({ 
  className = '', 
  color = '#3B82F6', 
  size = 100 
}: MorphingShapeProps) {
  const shapes = [
    'M50,10 L90,90 L10,90 Z', // Triangle
    'M10,50 Q10,10 50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50', // Circle
    'M10,10 L90,10 L90,90 L10,90 Z', // Square
    'M50,10 L75,30 L90,50 L75,70 L50,90 L25,70 L10,50 L25,30 Z' // Octagon
  ]

  const [currentShape, setCurrentShape] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
    >
      <motion.path
        d={shapes[currentShape]}
        fill={color}
        animate={{ d: shapes[currentShape] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </svg>
  )
}

// Enhanced button with multiple effects
interface EnhancedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export function EnhancedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: EnhancedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800',
    ghost: 'bg-transparent border border-gray-300 text-gray-700'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <Magnetic intensity={0.2} disabled={disabled}>
      <motion.button
        className={`
          relative overflow-hidden rounded-lg font-medium transition-all duration-200
          ${variants[variant]} ${sizes[size]} ${className}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        {/* Ripple effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </Magnetic>
  )
}