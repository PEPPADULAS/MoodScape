'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/contexts/theme-context'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  emoji: string
  color?: string
}

interface ParticleSystemProps {
  enabled?: boolean
  particleCount?: number
  className?: string
}

export default function ParticleSystem({ 
  enabled = true, 
  particleCount = 15,
  className = "fixed inset-0 pointer-events-none z-10"
}: ParticleSystemProps) {
  const { currentTheme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Get seasonal particles configuration
  const getSeasonalConfig = (theme: string) => {
    const baseConfig = {
      gravity: 0.1,
      wind: 0.05,
      emojis: ['🌟'],
      colors: ['rgba(255, 255, 255, 0.8)'],
      sizeRange: [8, 16],
      speedRange: [0.5, 2]
    }

    switch (true) {
      case theme.includes('spring'):
        return {
          ...baseConfig,
          emojis: ['🌸', '🌺', '🌷', '🌻', '🦋', '🐝'],
          colors: ['rgba(255, 182, 193, 0.8)', 'rgba(255, 192, 203, 0.8)', 'rgba(255, 105, 180, 0.8)'],
          gravity: 0.02,
          wind: 0.1,
          sizeRange: [6, 12]
        }
      
      case theme.includes('summer'):
        return {
          ...baseConfig,
          emojis: ['☀️', '🌞', '🌻', '🦋', '🌺', '🐛'],
          colors: ['rgba(255, 215, 0, 0.8)', 'rgba(255, 165, 0, 0.8)', 'rgba(255, 140, 0, 0.8)'],
          gravity: 0.01,
          wind: 0.15,
          sizeRange: [8, 14]
        }
      
      case theme.includes('fall'):
        return {
          ...baseConfig,
          emojis: ['🍂', '🍁', '🌰', '🎃', '🦔'],
          colors: ['rgba(255, 140, 0, 0.8)', 'rgba(255, 69, 0, 0.8)', 'rgba(139, 69, 19, 0.8)'],
          gravity: 0.15,
          wind: 0.08,
          sizeRange: [10, 18]
        }
      
      case theme.includes('winter'):
        return {
          ...baseConfig,
          emojis: ['❄️', '⭐', '✨', '🌨️'],
          colors: ['rgba(240, 248, 255, 0.9)', 'rgba(173, 216, 230, 0.8)', 'rgba(176, 224, 230, 0.8)'],
          gravity: 0.05,
          wind: 0.03,
          sizeRange: [6, 14]
        }
      
      case theme.includes('rainy'):
        return {
          ...baseConfig,
          emojis: ['💧', '🌧️', '☔', '🌦️'],
          colors: ['rgba(70, 130, 180, 0.8)', 'rgba(100, 149, 237, 0.8)', 'rgba(135, 206, 235, 0.8)'],
          gravity: 0.3,
          wind: 0.02,
          sizeRange: [4, 8],
          speedRange: [2, 4]
        }
      
      default:
        return baseConfig
    }
  }

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Create particles
  useEffect(() => {
    if (!enabled || !dimensions.width || !dimensions.height) return

    const config = getSeasonalConfig(currentTheme)
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      const emoji = config.emojis[Math.floor(Math.random() * config.emojis.length)]
      const color = config.colors[Math.floor(Math.random() * config.colors.length)]
      
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: -Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * config.wind * 10,
        vy: Math.random() * config.speedRange[1] + config.speedRange[0],
        size: Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        opacity: Math.random() * 0.6 + 0.4,
        emoji,
        color
      })
    }

    setParticles(newParticles)
  }, [enabled, currentTheme, particleCount, dimensions])

  // Start animation when particles are available
  useEffect(() => {
    if (!enabled || particles.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [enabled, particles.length])

  // Animation loop
  useEffect(() => {
    if (!enabled || particles.length === 0) return

    const config = getSeasonalConfig(currentTheme)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particlesData = [...particles]
    let frameCount = 0

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      
      particlesData = particlesData.map(particle => {
        // Update position
        let newX = particle.x + particle.vx
        let newY = particle.y + particle.vy + config.gravity
        
        // Apply wind effect
        newX += Math.sin(Date.now() * 0.001 + particle.id) * config.wind
        
        // Wrap around screen
        if (newX < -50) newX = dimensions.width + 50
        if (newX > dimensions.width + 50) newX = -50
        if (newY > dimensions.height + 50) {
          newY = -50
          newX = Math.random() * dimensions.width
        }

        // Update rotation
        const newRotation = particle.rotation + particle.rotationSpeed

        // Draw particle
        ctx.save()
        ctx.translate(newX, newY)
        ctx.rotate((newRotation * Math.PI) / 180)
        ctx.globalAlpha = particle.opacity
        ctx.font = `${particle.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Add glow effect for winter/rainy themes
        if (currentTheme.includes('winter') || currentTheme.includes('rainy')) {
          ctx.shadowColor = particle.color || 'white'
          ctx.shadowBlur = 10
        }
        
        ctx.fillText(particle.emoji, 0, 0)
        ctx.restore()

        return {
          ...particle,
          x: newX,
          y: newY,
          rotation: newRotation
        }
      })

      // Update state less frequently to reduce re-renders
      frameCount++
      if (frameCount % 5 === 0) {
        setParticles([...particlesData])
      }
      
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [enabled, currentTheme, dimensions.width, dimensions.height])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  )
}