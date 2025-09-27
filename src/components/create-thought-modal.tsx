'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { getCurrentSeason } from '@/lib/utils'
import { SmartTagSuggestions } from './smart-tag-suggestions'
import { ThemedInput, ThemedTextarea, ThemedSelect } from '@/components/ui/themed-input'
import { getFontStack } from '@/lib/utils'
import { getFontClass } from '@/lib/fonts'

interface Thought {
  id: string
  title?: string
  content: string
  mood?: string
  weather?: string
  season?: string
  tags?: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

interface CreateThoughtModalProps {
  isOpen: boolean
  onClose: () => void
  onThoughtCreated: (thought: Thought) => void
}

export default function CreateThoughtModal({ isOpen, onClose, onThoughtCreated }: CreateThoughtModalProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [weather, setWeather] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [font, setFont] = useState<string>('')
  const [language, setLanguage] = useState<string>('')

  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const res = await fetch('/api/user/settings')
        if (res.ok) {
          const settings = await res.json()
          if (settings?.defaultFont) setFont(settings.defaultFont)
          if (settings?.defaultLanguage) setLanguage(settings.defaultLanguage)
        }
      } catch {}
    }
    if (isOpen) loadDefaults()
  }, [isOpen])

  const moods = [
    { value: 'happy', label: '😊 Happy' },
    { value: 'sad', label: '😢 Sad' },
    { value: 'excited', label: '🤩 Excited' },
    { value: 'calm', label: '😌 Calm' },
    { value: 'anxious', label: '😰 Anxious' },
    { value: 'grateful', label: '🙏 Grateful' },
    { value: 'creative', label: '🎨 Creative' },
    { value: 'thoughtful', label: '🤔 Thoughtful' },
  ]

  const weathers = [
    { value: 'sunny', label: '☀️ Sunny' },
    { value: 'cloudy', label: '☁️ Cloudy' },
    { value: 'rainy', label: '🌧️ Rainy' },
    { value: 'snowy', label: '❄️ Snowy' },
    { value: 'windy', label: '💨 Windy' },
    { value: 'stormy', label: '⛈️ Stormy' },
    { value: 'foggy', label: '🌫️ Foggy' },
  ]

  const resetForm = () => {
    setTitle('')
    setContent('')
    setMood('')
    setWeather('')
    setTags([])
    setTagInput('')
    setIsPrivate(false)
    setFont('')
    setLanguage('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleAddTag = (tagToAdd?: string) => {
    const tag = tagToAdd || tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      if (!tagToAdd) setTagInput('') // Only clear input if manually typed
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.currentTarget.tagName !== 'TEXTAREA') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || null,
          content: content.trim(),
          mood: mood || null,
          weather: weather || null,
          tags: tags.length > 0 ? tags : null,
          isPrivate,
          font: font || null,
          language: language || null,
        }),
      })

      if (response.ok) {
        const newThought = await response.json()
        onThoughtCreated(newThought)
        handleClose()
      }
    } catch (error) {
      console.error('Failed to create thought:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${theme.card} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{theme.emoji}</span>
                  <h2 className={`text-xl font-bold ${theme.text}`}>
                    Capture a Thought
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${theme.text}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Title (Optional)
                </label>
                <ThemedInput
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your thought a title..."
                />
              </div>

              {/* Font and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Font
                  </label>
                  <ThemedSelect value={font} onChange={(e) => setFont(e.target.value)}>
                    <option value="">System Default</option>
                    <option value="inter">Inter (Sans)</option>
                    <option value="poppins">Poppins (Sans)</option>
                    <option value="merriweather">Merriweather (Serif)</option>
                    <option value="playfair">Playfair Display (Serif)</option>
                    <option value="dancing-script">Dancing Script (Handwritten)</option>
                    <option value="pacifico">Pacifico (Handwritten)</option>
                    <option value="caveat">Caveat (Handwritten)</option>
                    <option value="special-elite">Special Elite (Typewriter)</option>
                    <option value="roboto-mono">Roboto Mono (Mono)</option>
                  </ThemedSelect>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Language
                  </label>
                  <ThemedSelect value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="">Follow Default</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                  </ThemedSelect>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  What&apos;s on your mind? *
                </label>
                <ThemedTextarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, experiences, or feelings..."
                  rows={5}
                  required
                  style={{ fontFamily: font ? getFontStack(font) : undefined }}
                  lang={language || undefined}
                />
              </div>

              {/* Mood & Weather */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    How are you feeling?
                  </label>
                  <ThemedSelect
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option value="">Select mood...</option>
                    {moods.map((moodOption) => (
                      <option key={moodOption.value} value={moodOption.value}>
                        {moodOption.label}
                      </option>
                    ))}
                  </ThemedSelect>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    What&apos;s the weather like?
                  </label>
                  <ThemedSelect
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                  >
                    <option value="">Select weather...</option>
                    {weathers.map((weatherOption) => (
                      <option key={weatherOption.value} value={weatherOption.value}>
                        {weatherOption.label}
                      </option>
                    ))}
                  </ThemedSelect>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Tags
                </label>
                
                {/* Manual Tag Input */}
                <div className="flex space-x-2 mb-3">
                  <ThemedInput
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add custom tags..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className={`px-4 py-2 ${theme.button} text-white rounded-lg transition-colors`}
                  >
                    Add
                  </button>
                </div>

                {/* Smart Tag Suggestions */}
                {content.trim().length > 10 && (
                  <SmartTagSuggestions
                    content={content}
                    existingTags={tags}
                    onTagSelect={handleAddTag}
                    onTagRemove={handleRemoveTag}
                    className="mb-3"
                  />
                )}

                {/* Selected Tags Display */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy */}
              <div className="mb-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded"
                  />
                  <div className="flex items-center space-x-2">
                    {isPrivate ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span className={`text-sm ${theme.text}`}>
                      {isPrivate ? 'Private thought' : 'Public thought'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-6 py-3 text-sm font-medium ${theme.text} hover:opacity-75 transition-opacity`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className={`flex items-center space-x-2 px-6 py-3 ${theme.button} text-white rounded-lg transition-colors disabled:opacity-50`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Thought'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}