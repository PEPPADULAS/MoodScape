'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'

interface ParallaxContainerProps {
  children: React.ReactNode
  speed?: number
  className?: string
  enableParallax?: boolean
}

export function ParallaxContainer({ 
  children, 
  speed = 0.5, 
  className = '', 
  enableParallax = true 
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])
  const springY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ y: enableParallax ? springY : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxLayerProps {
  children: React.ReactNode
  speed: number
  className?: string
  zIndex?: number
}

export function ParallaxLayer({ children, speed, className = '', zIndex = 1 }: ParallaxLayerProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000])

  return (
    <motion.div
      style={{ y, zIndex }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface ScrollTriggeredAnimationProps {
  children: React.ReactNode
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp'
  threshold?: number
  className?: string
  delay?: number
}

export function ScrollTriggeredAnimation({
  children,
  animation = 'fadeInUp',
  threshold = 0.1,
  className = '',
  delay = 0
}: ScrollTriggeredAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -60 },
      animate: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    slideInUp: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={animations[animation].initial}
      animate={isInView ? animations[animation].animate : animations[animation].initial}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.21, 1.11, 0.81, 0.99] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Enhanced scroll progress indicator
export function ScrollProgressIndicator() {
  const { theme } = useTheme()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform-gpu z-50"
      style={{ scaleX, transformOrigin: '0%' }}
    />
  )
}

// Staggered children animation
interface StaggeredAnimationProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggeredAnimation({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}: StaggeredAnimationProps) {
  const childrenArray = React.Children.toArray(children)
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: 'easeOut'
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

// 3D hover effect component
interface Hover3DProps {
  children: React.ReactNode
  depth?: number
  className?: string
  rotationIntensity?: number
}

export function Hover3D({ 
  children, 
  depth = 50, 
  className = '', 
  rotationIntensity = 10 
}: Hover3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const rotateXValue = (mouseY / rect.height) * rotationIntensity
    const rotateYValue = (mouseX / rect.width) * -rotationIntensity
    
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      animate={{
        rotateX,
        rotateY,
        z: rotateX !== 0 || rotateY !== 0 ? depth : 0
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}