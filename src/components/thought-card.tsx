'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Edit, Trash2, Eye, EyeOff, Heart, Bookmark } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { formatDate } from '@/lib/utils'
import { getFontStack } from '@/lib/utils'
import { getFontClass } from '@/lib/fonts'
import { TouchFeedback, SwipeNavigation } from './mobile/gesture-wrapper'
import { ResponsiveTypography } from './mobile/responsive-typography'
import { ThemedInput, ThemedTextarea } from '@/components/ui/themed-input'

interface Thought {
  id: string
  title?: string
  content: string
  mood?: string
  weather?: string
  season?: string
  tags?: string
  font?: string
  language?: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

interface ThoughtCardProps {
  thought: Thought
  onDelete: (id: string) => void
  onUpdate: (thought: Thought) => void
}

export default function ThoughtCard({ thought, onDelete, onUpdate }: ThoughtCardProps) {
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(thought.content)
  const [editTitle, setEditTitle] = useState(thought.title || '')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/thoughts/${thought.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle || null,
          content: editContent,
          font: thought.font ?? null,
          language: thought.language ?? null,
        }),
      })

      if (response.ok) {
        const updatedThought = await response.json()
        onUpdate(updatedThought)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update thought:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this thought?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/thoughts/${thought.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(thought.id)
      }
    } catch (error) {
      console.error('Failed to delete thought:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getSeasonEmoji = (season?: string) => {
    switch (season) {
      case 'spring': return '🌸'
      case 'summer': return '☀️'
      case 'fall': return '🍂'
      case 'winter': return '❄️'
      case 'rainy': return '🌧️'
      default: return '🌟'
    }
  }

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'excited': return '🤩'
      case 'calm': return '😌'
      case 'anxious': return '😰'
      case 'grateful': return '🙏'
      default: return ''
    }
  }

  const tags = thought.tags ? JSON.parse(thought.tags) : []

  return (
    <SwipeNavigation
      onSwipeLeft={handleDelete}
      onSwipeRight={() => setIsLiked(!isLiked)}
      leftAction={{
        icon: <Trash2 className="w-5 h-5" />,
        color: 'bg-red-500',
        label: 'Delete'
      }}
      rightAction={{
        icon: <Heart className="w-5 h-5" />,
        color: 'bg-pink-500',
        label: 'Like'
      }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 25 }
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="group"
      >
      <div
        className={`
          ${theme.card} rounded-xl p-6 relative overflow-hidden
          shadow-md group-hover:shadow-xl transition-all duration-300
          border border-transparent group-hover:border-opacity-20
          backdrop-blur-sm
          ${getFontClass(thought.font) || ''}
        `}
        lang={thought.language || undefined}
        style={{ fontFamily: thought.font ? getFontStack(thought.font) : undefined }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10"
          style={{
            background: `radial-gradient(circle at center, currentColor, transparent)`
          }}
        />

        {/* Header */}
        <motion.div 
          className="flex items-start justify-between mb-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2">
            <motion.span 
              className="text-2xl cursor-pointer"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {getSeasonEmoji(thought.season)}
            </motion.span>
            {thought.mood && (
              <motion.span 
                className="text-lg cursor-pointer"
                whileHover={{ scale: 1.2, rotate: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getMoodEmoji(thought.mood)}
              </motion.span>
            )}
            <AnimatePresence>
              {thought.isPrivate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <EyeOff className={`w-4 h-4 ${theme.accent}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-500 bg-red-50' : `${theme.text} hover:bg-gray-100`
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-blue-500 bg-blue-50' : `${theme.text} hover:bg-gray-100`
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-full hover:bg-gray-100 ${theme.text}`}
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-full hover:bg-red-50 text-red-500 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ThemedInput
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title (optional)"
              />
              <ThemedTextarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdate}
                  className={`px-3 py-1 text-sm ${theme.button} text-white rounded transition-colors`}
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {thought.title && (
                <motion.h3 
                  className={`font-semibold ${theme.text} mb-2`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {thought.title}
                </motion.h3>
              )}
              <motion.p 
                className={`${theme.text} mb-4 leading-relaxed`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {thought.content}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        {tags.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {tags.map((tag: string, index: number) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`px-2 py-1 text-xs rounded-full bg-gray-100 ${theme.text} cursor-pointer`}
              >
                #{tag}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="flex items-center justify-between text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className={`flex items-center space-x-1 ${theme.accent}`}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(new Date(thought.createdAt))}</span>
          </div>
          {thought.weather && (
            <motion.span 
              className={theme.accent}
              whileHover={{ scale: 1.1 }}
            >
              {thought.weather}
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
    </SwipeNavigation>
  )
}