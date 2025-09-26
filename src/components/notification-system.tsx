'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Calendar, Clock } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useSession } from 'next-auth/react'

interface Reminder {
  id: string
  title: string
  note?: string
  date: string
  notifyAt: string
}

interface NotificationSystemProps {
  children: React.ReactNode
}

export function NotificationSystem({ children }: NotificationSystemProps) {
  const { theme } = useTheme()
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<Reminder[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Check for due reminders every minute
    const checkReminders = async () => {
      // Only check for reminders if user is authenticated
      if (status !== 'authenticated') {
        console.log('User not authenticated, skipping reminder check. Status:', status)
        return
      }
      
      console.log('User is authenticated, session:', session) // Debug log
      
      try {
        console.log('Checking for due reminders...') // Debug log
        const response = await fetch('/api/calendar/reminders/due', {
          credentials: 'include' // Include credentials for authentication
        })
        console.log('Reminder API response status:', response.status) // Debug log
        
        if (response.ok) {
          const dueReminders = await response.json()
          console.log('Due reminders received:', dueReminders) // Debug log
          if (dueReminders.length > 0) {
            setNotifications(prev => {
              // Add new notifications that aren't already shown
              const newNotifications = dueReminders.filter(
                (reminder: Reminder) => !prev.some(n => n.id === reminder.id)
              )
              return [...prev, ...newNotifications]
            })
            setShowNotifications(true)
          }
        } else {
          // Handle HTTP errors
          const errorText = await response.text()
          console.error('Failed to fetch reminders:', response.status, response.statusText, errorText)
          
          // If unauthorized, don't show error (user might not be logged in yet)
          if (response.status === 401) {
            console.log('User not authenticated, skipping reminder check')
          }
        }
      } catch (error) {
        // Handle network errors
        console.error('Network error while fetching reminders:', error)
      }
    }

    // Don't check immediately if user is not authenticated yet
    if (status === 'authenticated') {
      checkReminders()
    }

    // Check every minute
    const interval = setInterval(() => {
      if (status === 'authenticated') {
        checkReminders()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [status, session])

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (notifications.length === 1) {
      setShowNotifications(false)
    }
  }

  const dismissAll = () => {
    setNotifications([])
    setShowNotifications(false)
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {children}
      
      {/* Notification Bell */}
      {notifications.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-4 left-4 z-50 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="w-6 h-6" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {notifications.length}
            </span>
          )}
        </motion.button>
      )}

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-16 left-4 z-50 w-80 max-w-[calc(100vw-2rem)]"
          >
            <div className={`${theme.card} rounded-xl shadow-2xl border ${
              theme.mode === 'light' ? 'border-gray-200' : 'border-white/20'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className={`w-5 h-5 ${theme.mode === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                  <h3 className={`font-semibold ${theme.text}`}>Reminders</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={dismissAll}
                    className={`text-xs px-2 py-1 rounded ${
                      theme.mode === 'light' 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                        : 'bg-white/10 hover:bg-white/20 text-white/60'
                    }`}
                  >
                    Dismiss All
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className={`p-1 rounded ${
                      theme.mode === 'light' 
                        ? 'hover:bg-gray-100 text-gray-500' 
                        : 'hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        theme.mode === 'light' ? 'bg-orange-100' : 'bg-orange-900/30'
                      }`}>
                        <Calendar className={`w-4 h-4 ${
                          theme.mode === 'light' ? 'text-orange-600' : 'text-orange-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${theme.text} mb-1`}>
                          {notification.title}
                        </h4>
                        {notification.note && (
                          <p className={`text-sm ${theme.accent} mb-2`}>
                            {notification.note}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(notification.notifyAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className={`p-1 rounded ${
                          theme.mode === 'light' 
                            ? 'hover:bg-gray-100 text-gray-400' 
                            : 'hover:bg-white/10 text-white/40'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}