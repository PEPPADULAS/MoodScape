'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Bell, Clock } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

interface ReminderModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onReminderCreated: () => void
}

export default function ReminderModal({ isOpen, onClose, selectedDate, onReminderCreated }: ReminderModalProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [notifyTime, setNotifyTime] = useState('09:00')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      // Create notifyAt datetime by combining the selected date with the notify time
      const notifyAt = new Date(selectedDate)
      const [hours, minutes] = notifyTime.split(':').map(Number)
      notifyAt.setHours(hours, minutes, 0, 0)

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          title: title.trim(),
          note: note.trim() || null,
          notifyAt: notifyAt.toISOString()
        })
      })

      if (response.ok) {
        setTitle('')
        setNote('')
        setNotifyTime('09:00')
        onReminderCreated()
        onClose()
      } else {
        console.error('Failed to create reminder')
      }
    } catch (error) {
      console.error('Error creating reminder:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-md mx-4 ${theme.card} rounded-xl shadow-2xl border ${
              theme.mode === 'light' ? 'border-gray-200' : 'border-white/20'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme.mode === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
                  <Bell className={`w-5 h-5 ${theme.mode === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${theme.text}`}>Create Reminder</h3>
                  <p className={`text-sm ${theme.accent}`}>{formatDate(selectedDate)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme.mode === 'light' 
                    ? 'hover:bg-gray-100 text-gray-500' 
                    : 'hover:bg-white/10 text-white/60'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Reminder Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Doctor's appointment, Meeting, Birthday"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    theme.mode === 'light'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      : 'border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                  }`}
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Additional Notes
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any additional details..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${
                    theme.mode === 'light'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      : 'border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                  }`}
                />
              </div>

              {/* Notification Time */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  Notification Time
                </label>
                <input
                  type="time"
                  value={notifyTime}
                  onChange={(e) => setNotifyTime(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    theme.mode === 'light'
                      ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      : 'border-white/20 bg-white/5 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                  }`}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme.mode === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme.mode === 'light'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-blue-500/40 hover:bg-blue-500/60 text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Creating...' : 'Create Reminder'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
