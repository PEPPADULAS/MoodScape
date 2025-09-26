'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Bell, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search 
} from 'lucide-react'
import { SmoothNavigation } from '@/components/navigation/smooth-navigation'
import { ThemedCalendar } from '@/components/charts/themed-calendar'
import ReminderModal from '@/components/reminder-modal'

type CategoryType = 'work' | 'personal' | 'health' | 'other'

interface Reminder {
  id: string
  title: string
  description: string
  date: string
  time: string
  category: CategoryType
  completed: boolean
}

interface FormData {
  title: string
  description: string
  date: string
  time: string
  category: CategoryType
}

export default function RemindersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, currentTheme, customGradient } = useTheme()
  
  // Apply custom gradient if it exists
  useEffect(() => {
    if (customGradient) {
      document.body.style.background = customGradient
      return () => {
        document.body.style.background = ''
      }
    }
  }, [customGradient])

  // State variables
  const [isReminderModalOpen, setReminderModalOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all')
  const [showCompleted, setShowCompleted] = useState(true)
  
  // Additional state variables for the UI
  const [filterCategory, setFilterCategory] = useState<'all' | CategoryType>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'personal'
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [reminderModalOpen, setReminderModalOpenState] = useState(false)

  // Computed values
  const upcomingReminders = reminders.filter(r => !r.completed)
  const completedReminders = reminders.filter(r => r.completed)

  // Helper functions
  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case 'work': return 'bg-blue-500'
      case 'personal': return 'bg-green-500'
      case 'health': return 'bg-red-500'
      default: return 'bg-purple-500'
    }
  }

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ))
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingId(reminder.id)
    setFormData({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
      category: reminder.category
    })
    setShowAddForm(true)
  }

  const handleDelete = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      // Update existing reminder
      setReminders(reminders.map(reminder => 
        reminder.id === editingId ? { ...reminder, ...formData } : reminder
      ))
      setEditingId(null)
    } else {
      // Add new reminder
      const newReminder: Reminder = {
        id: Date.now().toString(),
        ...formData,
        completed: false
      }
      setReminders([...reminders, newReminder])
    }
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      category: 'personal'
    })
    setShowAddForm(false)
  }

  const handleReminderCreated = () => {
    // Refresh reminders if needed
  }

  if (status === 'loading') {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className={`min-h-screen ${theme.background} relative`}>
      {/* Header */}
      <header className={`border-b ${theme.card.includes('border') ? theme.card.split(' ').find(c => c.includes('border')) : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🔔</span>
              <h1 className={`text-xl font-bold ${theme.text}`}>Reminders</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <SmoothNavigation onSignOut={() => signOut()} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className={`${theme.card} rounded-2xl shadow-lg p-8 mb-8 backdrop-blur-sm border`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className={`text-4xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                  Reminders
                </h1>
                <p className={`${theme.accent} mt-2`}>Never miss an important moment</p>
              </div>
              <motion.button
                onClick={() => setShowAddForm(true)}
                className={`${theme.button} text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Add Reminder
              </motion.button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} w-5 h-5`} />
                <input
                  type="text"
                  placeholder="Search reminders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme.mode === 'light' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-gray-800 border border-gray-600 text-white'} focus:ring-blue-500`}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as 'all' | CategoryType)}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme.mode === 'light' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-gray-800 border border-gray-600 text-white'} focus:ring-blue-500`}
              >
                <option value="all">All Categories</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          </motion.div>

          {/* Calendar and Reminders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`${theme.card} rounded-2xl shadow-lg p-6 backdrop-blur-sm border`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                  <CalendarIcon className="w-6 h-6 text-indigo-600" />
                  Calendar
                </h2>
                <ThemedCalendar />
              </div>
            </motion.div>

            {/* Reminders Section */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Upcoming Reminders */}
              <div className={`${theme.card} rounded-2xl shadow-lg p-6 mb-8 backdrop-blur-sm border`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                  <Bell className="w-6 h-6 text-indigo-600" />
                  Upcoming Reminders
                </h2>
                <div className="space-y-4">
                  {upcomingReminders.length > 0 ? (
                    upcomingReminders.map((reminder, index) => (
                      <motion.div
                        key={reminder.id}
                        className={`${theme.card} rounded-xl p-6 hover:shadow-lg transition-all duration-300 backdrop-blur-sm border`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-white text-xs ${getCategoryColor(reminder.category)}`}>
                                {reminder.category}
                              </span>
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon className={`w-4 h-4 ${theme.accent}`} />
                                <span className={theme.accent}>{new Date(reminder.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className={`w-4 h-4 ${theme.accent}`} />
                                <span className={theme.accent}>{reminder.time}</span>
                              </div>
                            </div>
                            <h3 className={`text-lg font-semibold ${theme.text}`}>{reminder.title}</h3>
                            {reminder.description && (
                              <p className={`${theme.accent} mt-1`}>{reminder.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleComplete(reminder.id)}
                              className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(reminder)}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(reminder.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className={`rounded-xl p-8 text-center ${theme.mode === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-800/50'}`}>
                      <Bell className={`w-12 h-12 ${theme.accent} mx-auto mb-3`} />
                      <p className={theme.accent}>No upcoming reminders</p>
                      <p className={`text-sm mt-2 ${theme.accent} opacity-75`}>Click on the calendar to add reminders for specific dates</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Reminders */}
              {completedReminders.length > 0 && (
                <div className={`${theme.card} rounded-2xl shadow-lg p-6 backdrop-blur-sm border`}>
                  <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                    <Check className="w-6 h-6 text-green-600" />
                    Completed
                  </h2>
                  <div className="space-y-4">
                    {completedReminders.map((reminder, index) => (
                      <motion.div
                        key={reminder.id}
                        className={`rounded-xl p-6 opacity-75 ${theme.mode === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-800/50'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-white text-xs ${getCategoryColor(reminder.category)}`}>
                                {reminder.category}
                              </span>
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon className={`w-4 h-4 ${theme.accent}`} />
                                <span className={theme.accent}>{new Date(reminder.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className={`w-4 h-4 ${theme.accent}`} />
                                <span className={theme.accent}>{reminder.time}</span>
                              </div>
                            </div>
                            <h3 className={`text-lg font-semibold ${theme.text} line-through`}>
                              {reminder.title}
                            </h3>
                            {reminder.description && (
                              <p className={`${theme.accent} mt-1 line-through`}>{reminder.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleComplete(reminder.id)}
                              className="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(reminder.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className={`${theme.card} rounded-2xl p-8 max-w-md w-full backdrop-blur-sm border`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>
                  {editingId ? 'Edit Reminder' : 'New Reminder'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme.mode === 'light' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-gray-800 border border-gray-600 text-white'} focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme.mode === 'light' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-gray-800 border border-gray-600 text-white'} focus:ring-blue-500`}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme.mode === 'light' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-gray-800 border border-gray-600 text-white'} focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme.mode === 'light' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-gray-800 border border-gray-600 text-white'} focus:ring-blue-500`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme.mode === 'light' ? 'bg-white border border-gray-200 text-gray-900' : 'bg-gray-800 border border-gray-600 text-white'} focus:ring-blue-500`}
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className={`${theme.button} text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex-1`}
                    >
                      {editingId ? 'Update' : 'Add'} Reminder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingId(null)
                        setFormData({
                          title: '',
                          description: '',
                          date: '',
                          time: '',
                          category: 'personal'
                        })
                      }}
                      className={`py-2 rounded-lg transition-colors flex-1 ${theme.mode === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
      </div>
    </div>
  )
}