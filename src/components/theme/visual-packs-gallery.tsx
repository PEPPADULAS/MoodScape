'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'
import { VISUAL_PACKS, VisualPack, isPackUnlocked } from '@/lib/visual-packs'
import { getFontClass } from '@/lib/fonts'

export function VisualPacksGallery() {
  const { theme } = useTheme()
  const [packs, setPacks] = useState<VisualPack[]>([])
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/visual-packs')
        if (res.ok) {
          const data = await res.json()
          setUnlockedIds(data.unlockedAchievementIds || [])
          setPacks(data.packs || VISUAL_PACKS)
          setActive(data.active || null)
        } else {
          setPacks(VISUAL_PACKS)
        }
      } catch {
        setPacks(VISUAL_PACKS)
      }
    }
    load()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {packs.map((pack, idx) => {
        const unlocked = isPackUnlocked(pack, unlockedIds, 0)
        const isActive = active === pack.id
        const activate = async () => {
          if (!unlocked) return
          const res = await fetch('/api/visual-packs/activate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packId: pack.id }) })
          if (res.ok) {
            setActive(pack.id)
          }
        }
        return (
          <motion.div key={pack.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
            className={`${theme.card} rounded-xl p-5 relative overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} pointer-events-none`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-semibold ${theme.text} ${getFontClass(pack.fontPrimary) || ''}`}>{pack.name}</h3>
                <div className="flex gap-1 opacity-80">
                  {pack.stickers?.slice(0,3).map((s, i) => (
                    <span key={i} style={{ fontSize: s.size, opacity: s.opacity }}>{s.emoji}</span>
                  ))}
                </div>
              </div>
              <p className={`${theme.accent} text-sm mb-3`}>{pack.description}</p>
              <div className="flex gap-2 items-center">
                <button onClick={activate} disabled={!unlocked} className={`px-3 py-2 text-sm rounded-lg ${unlocked ? theme.button + ' text-white' : 'bg-white/10 ' + theme.accent}`}>
                  {unlocked ? (isActive ? 'Active' : 'Activate') : 'Locked'}
                </button>
                {!unlocked && (
                  <span className={`text-xs ${theme.accent}`}>Unlock via achievements</span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}


