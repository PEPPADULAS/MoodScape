'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'
import { getCurrentSeason } from '@/lib/utils'

interface DynamicBackgroundProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function DynamicBackground({ className = '', intensity = 'medium' }: DynamicBackgroundProps) {
  const { theme } = useTheme()
  const [currentSeason, setCurrentSeason] = useState('spring') // Default value for SSR
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Set actual season after hydration
  useEffect(() => {
    setIsClient(true)
    setCurrentSeason(getCurrentSeason())
  }, [])

  useEffect(() => {
    if (!isClient) return // Don't start animation until after hydration
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation parameters based on intensity
    const intensityConfig = {
      low: { particleCount: 30, speed: 0.5 },
      medium: { particleCount: 60, speed: 1 },
      high: { particleCount: 100, speed: 1.5 }
    }

    const config = intensityConfig[intensity]
    const particles: any[] = []

    // Create particles based on season
    const createParticles = () => {
      particles.length = 0
      
      for (let i = 0; i < config.particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          hue: getSeasonalHue(),
          life: Math.random() * 100
        })
      }
    }

    const getSeasonalHue = () => {
      switch (currentSeason) {
        case 'spring': return Math.random() * 60 + 300 // Pink to purple
        case 'summer': return Math.random() * 60 + 45 // Yellow to orange
        case 'fall': return Math.random() * 40 + 20 // Orange to red
        case 'winter': return Math.random() * 60 + 180 // Blue to cyan
        case 'rainy': return Math.random() * 40 + 200 // Blue tones
        default: return Math.random() * 360
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 0.5

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Pulsing effect
        const pulse = Math.sin(particle.life * 0.02) * 0.5 + 0.5
        const currentOpacity = particle.opacity * pulse

        // Draw particle
        ctx.save()
        ctx.globalAlpha = currentOpacity
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Draw connections between nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = (1 - distance / 100) * 0.1
            ctx.strokeStyle = `hsl(${(particle.hue + otherParticle.hue) / 2}, 50%, 50%)`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [currentSeason, intensity, isClient])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none opacity-30 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

// Gradient background component
export function SeasonalGradientBackground() {
  const [currentSeason, setCurrentSeason] = useState<'spring' | 'summer' | 'fall' | 'winter' | 'rainy'>('spring') // Default for SSR
  const [isClient, setIsClient] = useState(false)
  
  // Set actual season after hydration
  useEffect(() => {
    setIsClient(true)
    setCurrentSeason(getCurrentSeason() as 'spring' | 'summer' | 'fall' | 'winter' | 'rainy')
  }, [])
  
  const seasonalGradients: Record<'spring' | 'summer' | 'fall' | 'winter' | 'rainy', string> = {
    spring: 'from-pink-200 via-purple-200 to-indigo-200',
    summer: 'from-yellow-200 via-orange-200 to-red-200',
    fall: 'from-orange-200 via-red-200 to-yellow-200',
    winter: 'from-blue-200 via-cyan-200 to-purple-200',
    rainy: 'from-gray-300 via-blue-200 to-gray-400'
  }

  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${seasonalGradients[currentSeason]} opacity-20 pointer-events-none`}
      animate={{
        background: [
          `linear-gradient(45deg, var(--gradient-start), var(--gradient-end))`,
          `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`,
          `linear-gradient(225deg, var(--gradient-start), var(--gradient-end))`,
          `linear-gradient(315deg, var(--gradient-start), var(--gradient-end))`
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

// Constellation effect for night themes
export function ConstellationEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stars, setStars] = useState<Array<{x: number, y: number, size: number, twinkle: number}>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Generate random stars
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 50; i++) {
        newStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          twinkle: Math.random() * Math.PI * 2
        })
      }
      setStars(newStars)
    }

    generateStars()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.twinkle += 0.05
        const opacity = (Math.sin(star.twinkle) + 1) / 2 * 0.8 + 0.2

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      generateStars()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
    />
  )
}

// Weather particles component
interface WeatherParticlesProps {
  weather: 'rain' | 'snow' | 'wind' | 'storm' | null
  intensity?: number
}

export function WeatherParticles({ weather, intensity = 1 }: WeatherParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!weather) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []

    const createWeatherParticles = () => {
      const count = Math.floor(50 * intensity)
      
      for (let i = 0; i < count; i++) {
        switch (weather) {
          case 'rain':
            particles.push({
              x: Math.random() * canvas.width,
              y: -10,
              vx: Math.random() * 2 - 1,
              vy: Math.random() * 5 + 5,
              length: Math.random() * 20 + 10,
              opacity: Math.random() * 0.8 + 0.2
            })
            break
          case 'snow':
            particles.push({
              x: Math.random() * canvas.width,
              y: -10,
              vx: Math.random() * 2 - 1,
              vy: Math.random() * 2 + 1,
              size: Math.random() * 4 + 2,
              opacity: Math.random() * 0.8 + 0.2,
              rotation: Math.random() * Math.PI * 2
            })
            break
        }
      }
    }

    createWeatherParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (weather === 'rain') {
          ctx.save()
          ctx.globalAlpha = particle.opacity
          ctx.strokeStyle = '#4A90E2'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.length)
          ctx.stroke()
          ctx.restore()
        } else if (weather === 'snow') {
          particle.rotation += 0.02
          ctx.save()
          ctx.globalAlpha = particle.opacity
          ctx.fillStyle = '#ffffff'
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.rotation)
          ctx.beginPath()
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // Remove particles that are off-screen
        if (particle.y > canvas.height + 20) {
          particles.splice(index, 1)
          // Add new particle at the top
          if (weather === 'rain') {
            particles.push({
              x: Math.random() * canvas.width,
              y: -10,
              vx: Math.random() * 2 - 1,
              vy: Math.random() * 5 + 5,
              length: Math.random() * 20 + 10,
              opacity: Math.random() * 0.8 + 0.2
            })
          } else if (weather === 'snow') {
            particles.push({
              x: Math.random() * canvas.width,
              y: -10,
              vx: Math.random() * 2 - 1,
              vy: Math.random() * 2 + 1,
              size: Math.random() * 4 + 2,
              opacity: Math.random() * 0.8 + 0.2,
              rotation: Math.random() * Math.PI * 2
            })
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [weather, intensity])

  if (!weather) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
    />
  )
}