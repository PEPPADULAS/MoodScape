'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Bell, Trash2, Edit2, Check, X, Search } from 'lucide-react'

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
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | CategoryType>('all')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'personal'
  })

  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders')
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders))
  }, [reminders])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      setReminders(reminders.map(reminder =>
        reminder.id === editingId
          ? { ...reminder, ...formData }
          : reminder
      ))
      setEditingId(null)
    } else {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        ...formData,
        completed: false
      }
      setReminders([...reminders, newReminder])
    }

    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      category: 'personal'
    })
    setShowAddForm(false)
  }

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
      category: reminder.category
    })
    setEditingId(reminder.id)
    setShowAddForm(true)
  }

  const handleDelete = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id))
  }

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ))
  }

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || reminder.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const upcomingReminders = filteredReminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())

  const completedReminders = filteredReminders.filter(r => r.completed)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue-500'
      case 'personal': return 'bg-purple-500'
      case 'health': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Reminders
                </h1>
                <p className="text-gray-600 mt-2">Never miss an important moment</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Reminder
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reminders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as 'all' | CategoryType)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? 'Edit Reminder' : 'New Reminder'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
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
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Upcoming Reminders */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-indigo-600" />
              Upcoming Reminders
            </h2>
            <div className="grid gap-4">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-white text-xs ${getCategoryColor(reminder.category)}`}>
                            {reminder.category}
                          </span>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(reminder.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock className="w-4 h-4" />
                            {reminder.time}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{reminder.title}</h3>
                        {reminder.description && (
                          <p className="text-gray-600 mt-1">{reminder.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleComplete(reminder.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming reminders</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Completed
              </h2>
              <div className="grid gap-4">
                {completedReminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="bg-gray-50 rounded-xl p-6 opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-white text-xs ${getCategoryColor(reminder.category)}`}>
                            {reminder.category}
                          </span>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(reminder.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock className="w-4 h-4" />
                            {reminder.time}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 line-through">
                          {reminder.title}
                        </h3>
                        {reminder.description && (
                          <p className="text-gray-600 mt-1 line-through">{reminder.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleComplete(reminder.id)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}