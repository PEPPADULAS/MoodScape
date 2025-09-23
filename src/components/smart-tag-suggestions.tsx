'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SmartTagService, TagSuggestion } from '@/lib/smart-tag-service'

interface SmartTagSuggestionsProps {
  content: string
  existingTags: string[]
  onTagSelect: (tag: string) => void
  onTagRemove: (tag: string) => void
  className?: string
}

const categoryIcons = {
  mood: '😊',
  activity: '🎯',
  theme: '💭',
  object: '📱',
  location: '📍'
}

const categoryColors = {
  mood: 'bg-pink-100 text-pink-800 border-pink-200',
  activity: 'bg-blue-100 text-blue-800 border-blue-200',
  theme: 'bg-purple-100 text-purple-800 border-purple-200',
  object: 'bg-green-100 text-green-800 border-green-200',
  location: 'bg-orange-100 text-orange-800 border-orange-200'
}

export function SmartTagSuggestions({
  content,
  existingTags,
  onTagSelect,
  onTagRemove,
  className = ''
}: SmartTagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (content.trim().length > 10) {
      // Generate smart suggestions
      const newSuggestions = SmartTagService.generateSuggestions(content)
      setSuggestions(newSuggestions.filter(s => 
        !existingTags.includes(s.tag) && s.confidence > 0.3
      ))

      // Generate hashtags
      const newHashtags = SmartTagService.suggestHashtags(content)
      setHashtags(newHashtags.filter(h => !existingTags.includes(h)))

      // Detect sentiment
      const newSentiment = SmartTagService.detectSentiment(content)
      setSentiment(newSentiment)
    } else {
      setSuggestions([])
      setHashtags([])
      setSentiment('neutral')
    }
  }, [content, existingTags])

  if (suggestions.length === 0 && hashtags.length === 0) {
    return null
  }

  const getSentimentDisplay = () => {
    switch (sentiment) {
      case 'positive':
        return { emoji: '😊', text: 'Positive vibes detected!', color: 'text-green-600' }
      case 'negative':
        return { emoji: '🤗', text: 'Processing emotions...', color: 'text-blue-600' }
      default:
        return { emoji: '😌', text: 'Neutral tone', color: 'text-gray-600' }
    }
  }

  const sentimentDisplay = getSentimentDisplay()

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-lg">🏷️</div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Smart Suggestions
          </h3>
        </div>
        
        {/* Sentiment Indicator */}
        <div className={`flex items-center space-x-1 text-xs ${sentimentDisplay.color}`}>
          <span>{sentimentDisplay.emoji}</span>
          <span>{sentimentDisplay.text}</span>
        </div>
      </div>

      {/* Tag Suggestions by Category */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              AI Suggestions
            </h4>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isExpanded ? 'Show Less' : 'Show All'}
            </button>
          </div>
          
          <div className="space-y-2">
            {Object.entries(
              suggestions.reduce((acc, suggestion) => {
                if (!acc[suggestion.category]) {
                  acc[suggestion.category] = []
                }
                acc[suggestion.category].push(suggestion)
                return acc
              }, {} as Record<string, TagSuggestion[]>)
            ).map(([category, categorySuggestions]) => (
              <div key={category}>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {category}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {categorySuggestions
                    .slice(0, isExpanded ? undefined : 3)
                    .map((suggestion) => (
                    <motion.button
                      key={suggestion.tag}
                      onClick={() => onTagSelect(suggestion.tag)}
                      className={`
                        inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border
                        ${categoryColors[suggestion.category]}
                        hover:bg-opacity-80 transition-all duration-200
                        transform hover:scale-105 active:scale-95
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>{suggestion.tag}</span>
                      <div className="flex items-center">
                        {Array.from({ length: Math.ceil(suggestion.confidence * 3) }, (_, i) => (
                          <div key={i} className="w-1 h-1 bg-current rounded-full opacity-60" />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hashtag Suggestions */}
      {hashtags.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
            Trending Tags
          </h4>
          <div className="flex flex-wrap gap-1">
            {hashtags.map((hashtag) => (
              <motion.button
                key={hashtag}
                onClick={() => onTagSelect(hashtag)}
                className="
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200
                  hover:from-blue-100 hover:to-purple-100 transition-all duration-200
                  transform hover:scale-105 active:scale-95
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {hashtag}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tags Display */}
      {existingTags.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
            Selected Tags
          </h4>
          <div className="flex flex-wrap gap-1">
            {existingTags.map((tag) => (
              <motion.div
                key={tag}
                className="
                  inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                  bg-gray-100 text-gray-800 border border-gray-300
                  dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600
                "
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <span>{tag}</span>
                <button
                  onClick={() => onTagRemove(tag)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-start space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="mt-0.5">💡</span>
          <span>
            Tags help you organize and find your thoughts. AI suggestions improve as you write more!
          </span>
        </div>
      </div>
    </motion.div>
  )
}