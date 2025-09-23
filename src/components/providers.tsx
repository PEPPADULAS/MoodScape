'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/theme-context'
import { MusicProvider } from '@/contexts/music-context'
import ParticleWrapper from './particles/particle-wrapper'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <MusicProvider>
          <ParticleWrapper>
            {children}
          </ParticleWrapper>
        </MusicProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}