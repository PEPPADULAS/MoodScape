'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Calendar, Tag, Hash, Clock, SlidersHorizontal } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { ThemedInput, ThemedSelect } from '@/components/ui/themed-input'

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

interface SearchFilters {
  searchTerm: string
  selectedMood: string
  selectedSeason: string
  selectedTags: string[]
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom'
  sortBy: 'newest' | 'oldest' | 'mood' | 'title'
  showPrivate: boolean
}

interface EnhancedSearchFilterProps {
  thoughts: Thought[]
  onFilteredThoughts: (filteredThoughts: Thought[]) => void
  className?: string
}

export default function EnhancedSearchFilter({
  thoughts,
  onFilteredThoughts,
  className = ''
}: EnhancedSearchFilterProps) {
  const { theme } = useTheme()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedMood: '',
    selectedSeason: '',
    selectedTags: [],
    dateRange: 'all',
    sortBy: 'newest',
    showPrivate: true
  })

  // Extract all unique tags from thoughts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    thoughts.forEach(thought => {
      if (thought.tags) {
        try {
          const tags = JSON.parse(thought.tags)
          tags.forEach((tag: string) => tagSet.add(tag))
        } catch {
          // Handle invalid JSON
        }
      }
    })
    return Array.from(tagSet).sort()
  }, [thoughts])

  // Filter and sort thoughts based on current filters
  const filteredAndSortedThoughts = useMemo(() => {
    let filtered = thoughts.filter(thought => {
      // Text search (title and content)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const titleMatch = thought.title?.toLowerCase().includes(searchLower)
        const contentMatch = thought.content.toLowerCase().includes(searchLower)
        if (!titleMatch && !contentMatch) return false
      }

      // Mood filter
      if (filters.selectedMood && thought.mood !== filters.selectedMood) {
        return false
      }

      // Season filter
      if (filters.selectedSeason && thought.season !== filters.selectedSeason) {
        return false
      }

      // Tags filter
      if (filters.selectedTags.length > 0) {
        try {
          const thoughtTags = thought.tags ? JSON.parse(thought.tags) : []
          const hasMatchingTag = filters.selectedTags.some(filterTag => 
            thoughtTags.includes(filterTag)
          )
          if (!hasMatchingTag) return false
        } catch {
          return false
        }
      }

      // Privacy filter
      if (!filters.showPrivate && thought.isPrivate) {
        return false
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const thoughtDate = new Date(thought.createdAt)
        const now = new Date()
        
        switch (filters.dateRange) {
          case 'today':
            if (thoughtDate.toDateString() !== now.toDateString()) return false
            break
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            if (thoughtDate < weekAgo) return false
            break
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            if (thoughtDate < monthAgo) return false
            break
        }
      }

      return true
    })

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'title':
          return (a.title || a.content.substring(0, 50)).localeCompare(
            b.title || b.content.substring(0, 50)
          )
        case 'mood':
          return (a.mood || '').localeCompare(b.mood || '')
        default:
          return 0
      }
    })

    return filtered
  }, [thoughts, filters])

  // Update parent component when filtered thoughts change
  useEffect(() => {
    onFilteredThoughts(filteredAndSortedThoughts)
  }, [filteredAndSortedThoughts, onFilteredThoughts])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const addTag = (tag: string) => {
    if (!filters.selectedTags.includes(tag)) {
      updateFilter('selectedTags', [...filters.selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateFilter('selectedTags', filters.selectedTags.filter(t => t !== tag))
  }

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      selectedMood: '',
      selectedSeason: '',
      selectedTags: [],
      dateRange: 'all',
      sortBy: 'newest',
      showPrivate: true
    })
  }

  const activeFiltersCount = [
    filters.searchTerm,
    filters.selectedMood,
    filters.selectedSeason,
    filters.selectedTags.length > 0 ? 'tags' : '',
    filters.dateRange !== 'all' ? 'date' : '',
    !filters.showPrivate ? 'privacy' : ''
  ].filter(Boolean).length

  return (
    <motion.div
      className={`${theme.card} rounded-xl p-6 shadow-lg backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className={`w-5 h-5 ${theme.accent}`} />
          <h3 className={`text-lg font-semibold ${theme.text}`}>
            Find Your Thoughts
          </h3>
          {activeFiltersCount > 0 && (
            <motion.span
              className={`px-2 py-1 text-xs rounded-full ${theme.button} text-white`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {activeFiltersCount} active
            </motion.span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-2 rounded-lg hover:bg-gray-100 ${theme.text} transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </motion.button>
          
          {activeFiltersCount > 0 && (
            <motion.button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="relative mb-4">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.accent}`} />
        <ThemedInput
          type="text"
          placeholder="Find thoughts about... (try 'happy', 'work', 'family')"
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="pl-10 pr-4 py-3"
        />
        {filters.searchTerm && (
          <button
            onClick={() => updateFilter('searchTerm', '')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.accent} hover:text-red-500`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <ThemedSelect
          value={filters.selectedMood}
          onChange={(e) => updateFilter('selectedMood', e.target.value)}
        >
          <option value="">All Moods</option>
          <option value="happy">😊 Happy</option>
          <option value="sad">😢 Sad</option>
          <option value="excited">🤩 Excited</option>
          <option value="calm">😌 Calm</option>
          <option value="anxious">😰 Anxious</option>
          <option value="grateful">🙏 Grateful</option>
        </ThemedSelect>

        <ThemedSelect
          value={filters.selectedSeason}
          onChange={(e) => updateFilter('selectedSeason', e.target.value)}
        >
          <option value="">All Seasons</option>
          <option value="spring">🌸 Spring</option>
          <option value="summer">☀️ Summer</option>
          <option value="fall">🍂 Fall</option>
          <option value="winter">❄️ Winter</option>
          <option value="rainy">🌧️ Rainy</option>
        </ThemedSelect>

        <ThemedSelect
          value={filters.dateRange}
          onChange={(e) => updateFilter('dateRange', e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </ThemedSelect>
      </div>

      {/* Selected Tags */}
      {filters.selectedTags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {filters.selectedTags.map(tag => (
              <motion.span
                key={tag}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${theme.button} text-white`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Hash className="w-3 h-3 mr-1" />
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 pt-4 mt-4"
          >
            {/* Available Tags */}
            {availableTags.length > 0 && (
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  <Tag className="w-4 h-4 inline mr-1" />
                  Filter by Tags:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <motion.button
                      key={tag}
                      onClick={() => addTag(tag)}
                      disabled={filters.selectedTags.includes(tag)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        filters.selectedTags.includes(tag)
                          ? `${theme.button} text-white border-transparent`
                          : `${theme.text} border-gray-300 hover:bg-gray-100`
                      }`}
                      whileHover={{ scale: filters.selectedTags.includes(tag) ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort and Privacy Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  Sort by:
                </label>
                <ThemedSelect
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="mood">By Mood</option>
                </ThemedSelect>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Privacy:
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.showPrivate}
                    onChange={(e) => updateFilter('showPrivate', e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className={`text-sm ${theme.text}`}>Include private thoughts</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <motion.div
        className={`text-sm ${theme.accent} mt-4 pt-3 border-t border-gray-200`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Found {filteredAndSortedThoughts.length} of {thoughts.length} thoughts
        {filters.searchTerm && (
          <span> matching &quot;{filters.searchTerm}&quot;</span>
        )}
      </motion.div>
    </motion.div>
  )
}
