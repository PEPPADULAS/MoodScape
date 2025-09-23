'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { getFontClass } from '@/lib/fonts'
import { VISUAL_PACKS } from '@/lib/visual-packs'

export default function VisualPackOverlay({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/visual-packs')
        if (res.ok) {
          const data = await res.json()
          setActive(data.active || null)
        }
      } catch {}
    }
    load()
  }, [])

  const pack = VISUAL_PACKS.find(p => p.id === active)

  return (
    <div className={pack?.fontPrimary ? getFontClass(pack.fontPrimary) : ''}>
      {/* Subtle gradient overlay */}
      {pack && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient}`} />
          <div className="absolute inset-0 opacity-30">
            {pack.stickers?.slice(0, 12).map((s, i) => (
              <div key={i} className="absolute" style={{ left: `${(i*83)%100}%`, top: `${(i*37)%100}%`, fontSize: s.size, opacity: s.opacity }}>{s.emoji}</div>
            ))}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}


