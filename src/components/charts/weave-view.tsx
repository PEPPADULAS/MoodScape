'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'

interface ThreadEntry {
  id: string
  title: string | null
  createdAt: string
  mood?: string | null
  season?: string | null
}

interface Thread {
  tag: string
  entries: ThreadEntry[]
  spanMonths: number
}

export function WeaveView() {
  const { theme } = useTheme()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/thoughts/weave')
        if (res.ok) {
          const data = await res.json()
          setThreads(data.threads || [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className={`p-6 ${theme.text}`}>Building your narrative threads…</div>
  }

  if (threads.length === 0) {
    return <div className={`p-6 ${theme.accent}`}>No cross-links yet. Add tags to your thoughts to see the weave.</div>
  }

  return (
    <div className="space-y-6">
      {threads.map((thread, idx) => (
        <motion.div
          key={thread.tag}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03 }}
          className={`${theme.card} rounded-xl p-5`}
        >
          <div className="flex items-baseline justify-between mb-4">
            <h3 className={`text-lg font-semibold ${theme.text}`}>#{thread.tag}</h3>
            <span className={`text-xs ${theme.accent}`}>{thread.entries.length} entries</span>
          </div>

          <div className="relative overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="flex items-center gap-6">
                {thread.entries.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className="flex flex-col items-start">
                      <div className={`text-sm ${theme.text}`}>{e.title || 'Untitled'}</div>
                      <div className={`text-xs ${theme.accent}`}>{new Date(e.createdAt).toDateString()}</div>
                    </div>
                    {i < thread.entries.length - 1 && (
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}


