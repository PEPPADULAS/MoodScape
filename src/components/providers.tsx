'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/theme-context'
import { MusicProvider } from '@/contexts/music-context'
import { PersonalizationProvider } from '@/contexts/personalization-context'
import { SettingsProvider } from '@/contexts/settings-context'
import ParticleWrapper from './particles/particle-wrapper'
import VisualPackOverlay from './theme/visual-pack-overlay'
import { NotificationSystem } from './notification-system'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SettingsProvider>
          <PersonalizationProvider>
            <MusicProvider>
              <ParticleWrapper>
                <VisualPackOverlay>
                  <NotificationSystem>
                    {children}
                  </NotificationSystem>
                </VisualPackOverlay>
              </ParticleWrapper>
            </MusicProvider>
          </PersonalizationProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}