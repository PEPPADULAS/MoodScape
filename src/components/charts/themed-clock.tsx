'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/theme-context'

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function ThemedClock({ style = 'digital' as 'digital' | 'analog' }) {
  const { theme } = useTheme()
  const now = useNow()

  if (style === 'analog') {
    const seconds = now.getSeconds()
    const minutes = now.getMinutes() + seconds / 60
    const hours = (now.getHours() % 12) + minutes / 60
    const hand = (deg: number, w: number, h: number, color: string) => (
      <div className={`absolute left-1/2 top-1/2 origin-bottom ${color}`} style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)`, width: w, height: h, borderRadius: 2 }} />
    )
    return (
      <div className={`relative w-28 h-28 rounded-full border ${theme.card} flex items-center justify-center shadow-inner`}
           style={{ backdropFilter: 'blur(4px)' }}>
        <div className="absolute w-24 h-24 rounded-full border border-white/10" />
        {hand(hours * 30, 4, 28, 'bg-white/80')}
        {hand(minutes * 6, 3, 40, 'bg-white/70')}
        {hand(seconds * 6, 2, 46, 'bg-red-400')}
        <div className="absolute w-2 h-2 rounded-full bg-white" />
      </div>
    )
  }

  // digital
  const hh = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return (
    <div className={`px-4 py-2 rounded-xl shadow ${theme.card} ${theme.text}`} style={{ textShadow: '0 0 8px rgba(255,255,255,0.1)' }}>
      {hh}
    </div>
  )
}


