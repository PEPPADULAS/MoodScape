'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Bell, Edit, Trash2, Plus, Clock } from 'lucide-react'
import { SmoothNavigation } from '@/components/navigation/smooth-navigation'
import { useTheme } from '@/contexts/theme-context'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageTransition } from '@/components/animations/micro-interactions'
import { PageLoadingSpinner } from '@/components/loading/seasonal-loading'
import ReminderModal from '@/components/reminder-modal'

interface Reminder {
  id: string
  title: string
  note?: string
  date: string
  notifyAt: string
}

export default function RemindersPage() {
  const { theme } = useTheme()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchReminders()
    }
  }, [session, status, router])

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/calendar/events')
      if (response.ok) {
        const data = await response.json()
        setReminders(data)
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReminder = async (id: string) => {
    try {
      const response = await fetch(`/api/calendar/events/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setReminders(prev => prev.filter(r => r.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete reminder:', error)
    }
  }

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setSelectedDate(new Date(reminder.date))
    setReminderModalOpen(true)
  }

  const handleReminderCreated = () => {
    fetchReminders()
    setEditingReminder(null)
    setSelectedDate(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateString: string) => {
    const reminderDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return reminderDate >= today
  }

  const upcomingReminders = reminders.filter(r => isUpcoming(r.date))
  const pastReminders = reminders.filter(r => !isUpcoming(r.date))

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <PageLoadingSpinner />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <PageTransition>
      <div className={`min-h-screen ${theme.background}`}>
        {/* Header */}
        <header className={`border-b ${theme.card.includes('border') ? theme.card.split(' ').find(c => c.includes('border')) : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{theme.emoji}</span>
                <h1 className={`text-xl font-bold ${theme.text}`}>MoodScape</h1>
              </div>
              <div className="flex items-center space-x-4">
                <SmoothNavigation onSignOut={() => signOut()} />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${theme.mode === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
                <Bell className={`w-8 h-8 ${theme.mode === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${theme.text}`}>Reminders</h1>
                <p className={`${theme.accent}`}>Manage your upcoming events and notifications</p>
              </div>
            </div>
            <motion.button
              onClick={() => {
                setSelectedDate(new Date())
                setReminderModalOpen(true)
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                theme.mode === 'light'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500/40 hover:bg-blue-500/60 text-blue-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Add Reminder
            </motion.button>
          </div>

          {/* Upcoming Reminders */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
              <Calendar className="w-5 h-5" />
              Upcoming Reminders ({upcomingReminders.length})
            </h2>
            {upcomingReminders.length === 0 ? (
              <div className={`${theme.card} rounded-xl p-8 text-center`}>
                <Bell className={`w-12 h-12 mx-auto mb-4 ${theme.accent}`} />
                <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>No upcoming reminders</h3>
                <p className={`${theme.accent} mb-4`}>Create your first reminder to get started</p>
                <motion.button
                  onClick={() => {
                    setSelectedDate(new Date())
                    setReminderModalOpen(true)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    theme.mode === 'light'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500/40 hover:bg-blue-500/60 text-blue-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Reminder
                </motion.button>
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {upcomingReminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${theme.card} rounded-xl p-6 shadow-md`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                            {reminder.title}
                          </h3>
                          {reminder.note && (
                            <p className={`${theme.accent} mb-3`}>{reminder.note}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <div className={`flex items-center gap-1 ${theme.accent}`}>
                              <Calendar className="w-4 h-4" />
                              {formatDate(reminder.date)}
                            </div>
                            <div className={`flex items-center gap-1 ${theme.accent}`}>
                              <Clock className="w-4 h-4" />
                              {formatTime(reminder.notifyAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <motion.button
                            onClick={() => handleEditReminder(reminder)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme.mode === 'light'
                                ? 'hover:bg-gray-100 text-gray-600'
                                : 'hover:bg-white/10 text-white/60'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme.mode === 'light'
                                ? 'hover:bg-red-100 text-red-600'
                                : 'hover:bg-red-500/20 text-red-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Past Reminders */}
          {pastReminders.length > 0 && (
            <div>
              <h2 className={`text-xl font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                <Calendar className="w-5 h-5" />
                Past Reminders ({pastReminders.length})
              </h2>
              <div className="grid gap-4">
                <AnimatePresence>
                  {pastReminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${theme.card} rounded-xl p-6 shadow-md opacity-60`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                            {reminder.title}
                          </h3>
                          {reminder.note && (
                            <p className={`${theme.accent} mb-3`}>{reminder.note}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <div className={`flex items-center gap-1 ${theme.accent}`}>
                              <Calendar className="w-4 h-4" />
                              {formatDate(reminder.date)}
                            </div>
                            <div className={`flex items-center gap-1 ${theme.accent}`}>
                              <Clock className="w-4 h-4" />
                              {formatTime(reminder.notifyAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <motion.button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme.mode === 'light'
                                ? 'hover:bg-red-100 text-red-600'
                                : 'hover:bg-red-500/20 text-red-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Reminder Modal */}
        {selectedDate && (
          <ReminderModal
            isOpen={reminderModalOpen}
            onClose={() => {
              setReminderModalOpen(false)
              setSelectedDate(null)
              setEditingReminder(null)
            }}
            selectedDate={selectedDate}
            onReminderCreated={handleReminderCreated}
          />
        )}
      </div>
    </PageTransition>
  )
}
