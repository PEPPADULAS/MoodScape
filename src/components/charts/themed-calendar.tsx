'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import ReminderModal from '@/components/reminder-modal'

type DaySummary = { thoughts: number; moods: (string|null)[]; seasons: (string|null)[]; events: number }

function monthRange(year: number, month: number) {
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return { start, end }
}

function toISODate(d: Date) { return d.toISOString().slice(0,10) }

export function ThemedCalendar() {
  const { theme } = useTheme()
  const router = useRouter()
  const today = new Date()
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [days, setDays] = useState<Record<string, DaySummary>>({})
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { start, end } = useMemo(() => monthRange(cursor.y, cursor.m), [cursor])

  useEffect(() => {
    const load = async () => {
      const qs = new URLSearchParams({ start: toISODate(new Date(start)), end: toISODate(new Date(end)) })
      const res = await fetch(`/api/calendar/summary?${qs}`)
      if (res.ok) {
        const data = await res.json()
        setDays(data.days || {})
      }
    }
    load()
  }, [start, end])

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(cursor.y, cursor.m, day)
    setSelectedDate(clickedDate)
    setReminderModalOpen(true)
  }

  const handleReminderCreated = () => {
    // Reload calendar data to show new reminder
    const load = async () => {
      const qs = new URLSearchParams({ start: toISODate(new Date(start)), end: toISODate(new Date(end)) })
      const res = await fetch(`/api/calendar/summary?${qs}`)
      if (res.ok) {
        const data = await res.json()
        setDays(data.days || {})
      }
    }
    load()
  }

  const firstWeekday = new Date(cursor.y, cursor.m, 1).getDay()
  const numDays = end.getDate()
  const weeks: Array<Array<number|null>> = []
  let week: Array<number|null> = Array(firstWeekday).fill(null)
  for (let d = 1; d <= numDays; d++) {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)])

  const seasonEmoji = (s?: string|null) => {
    switch (s) {
      case 'spring': return '🌸'
      case 'summer': return '☀️'
      case 'fall': return '🍂'
      case 'winter': return '❄️'
      case 'rainy': return '🌧️'
      default: return ''
    }
  }

  return (
    <div className={`${theme.card} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <button className={`${theme.text} px-2 py-1`} onClick={() => setCursor(({ y, m }) => (m === 0 ? { y: y-1, m: 11 } : { y, m: m-1 }))}>◀</button>
        <div className={`font-semibold ${theme.text}`}>{new Date(cursor.y, cursor.m).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <button className={`${theme.text} px-2 py-1`} onClick={() => setCursor(({ y, m }) => (m === 11 ? { y: y+1, m: 0 } : { y, m: m+1 }))}>▶</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className={`${theme.accent}`}>{d}</div>
        ))}
        {weeks.flatMap((w, wi) => w.map((d, di) => {
          if (!d) return <div key={`${wi}-${di}`} />
          const dateKey = toISODate(new Date(cursor.y, cursor.m, d))
          const summary = days[dateKey]
          const isToday = dateKey === toISODate(today)
          const marker = summary?.seasons.find(Boolean) || null
          return (
            <motion.button
              key={`${wi}-${di}`}
              onClick={() => handleDateClick(d)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-lg p-2 border ${isToday ? 'ring-2 ring-offset-2 ring-blue-400' : 'border-white/10'} ${theme.text}`}
            >
              <div className="text-sm">{d}</div>
              <div className="h-5">
                <span title={marker || undefined}>{seasonEmoji(marker)}</span>
              </div>
              <div className="flex justify-center gap-1 text-[10px] opacity-70">
                {summary?.events ? <span>🔔{summary.events}</span> : null}
                {summary?.thoughts ? <span>✍️{summary.thoughts}</span> : null}
              </div>
            </motion.button>
          )
        }))}
      </div>

      {/* Reminder Modal */}
      {selectedDate && (
        <ReminderModal
          isOpen={reminderModalOpen}
          onClose={() => {
            setReminderModalOpen(false)
            setSelectedDate(null)
          }}
          selectedDate={selectedDate}
          onReminderCreated={handleReminderCreated}
        />
      )}
    </div>
  )
}


