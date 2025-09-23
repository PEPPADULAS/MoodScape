'use client'

import { useState, useEffect } from 'react'
import ParticleSystem from './particle-system'

interface ParticleWrapperProps {
  children: React.ReactNode
}

export default function ParticleWrapper({ children }: ParticleWrapperProps) {
  const [particlesEnabled] = useState(false)
  const [particleCount] = useState(15)

  return (
    <>
      {children}
      <ParticleSystem 
        enabled={particlesEnabled} 
        particleCount={particleCount}
      />
    </>
  )
}