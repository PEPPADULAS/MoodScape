'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'

interface MoodDataPoint {
  date: string
  mood: string
  count: number
  emoji: string
  color: string
}

interface MoodTimelineProps {
  className?: string
}

export default function MoodTimeline({ className = "" }: MoodTimelineProps) {
  const { theme } = useTheme()
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPoint, setSelectedPoint] = useState<MoodDataPoint | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<MoodDataPoint | null>(null)

  // Mood configuration
  const moodConfig: Record<string, { emoji: string; color: string; lightColor: string }> = {
    happy: { emoji: '😊', color: '#10B981', lightColor: '#D1FAE5' },
    sad: { emoji: '😢', color: '#6B7280', lightColor: '#F3F4F6' },
    excited: { emoji: '🤩', color: '#F59E0B', lightColor: '#FEF3C7' },
    calm: { emoji: '😌', color: '#06B6D4', lightColor: '#CFFAFE' },
    anxious: { emoji: '😰', color: '#EF4444', lightColor: '#FEE2E2' },
    grateful: { emoji: '🙏', color: '#8B5CF6', lightColor: '#EDE9FE' },
    creative: { emoji: '🎨', color: '#EC4899', lightColor: '#FCE7F3' },
    thoughtful: { emoji: '🤔', color: '#6366F1', lightColor: '#E0E7FF' }
  }

  useEffect(() => {
    fetchMoodData()
  }, [])

  const fetchMoodData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/thoughts/mood-timeline')
      if (response.ok) {
        const data = await response.json()
        const processedData = processMoodData(data)
        setMoodData(processedData)
      }
    } catch (error) {
      console.error('Failed to fetch mood data:', error)
      // Generate sample data for demo
      generateSampleData()
    } finally {
      setLoading(false)
    }
  }

  const processMoodData = (data: any[]): MoodDataPoint[] => {
    const moodCounts: Record<string, Record<string, number>> = {}
    
    data.forEach(thought => {
      if (thought.mood) {
        const date = new Date(thought.createdAt).toISOString().split('T')[0]
        if (!moodCounts[date]) {
          moodCounts[date] = {}
        }
        moodCounts[date][thought.mood] = (moodCounts[date][thought.mood] || 0) + 1
      }
    })

    const result: MoodDataPoint[] = []
    Object.entries(moodCounts).forEach(([date, moods]) => {
      Object.entries(moods).forEach(([mood, count]) => {
        const config = moodConfig[mood] || { emoji: '💭', color: '#6B7280', lightColor: '#F3F4F6' }
        result.push({
          date,
          mood,
          count,
          emoji: config.emoji,
          color: config.color
        })
      })
    })

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const generateSampleData = () => {
    const moods = Object.keys(moodConfig)
    const data: MoodDataPoint[] = []
    const today = new Date()
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      // Randomly add 1-3 mood entries per day
      const numEntries = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numEntries; j++) {
        const mood = moods[Math.floor(Math.random() * moods.length)]
        const config = moodConfig[mood]
        const existingEntry = data.find(d => d.date === dateString && d.mood === mood)
        
        if (existingEntry) {
          existingEntry.count++
        } else {
          data.push({
            date: dateString,
            mood,
            count: 1,
            emoji: config.emoji,
            color: config.color
          })
        }
      }
    }
    
    setMoodData(data)
  }

  const getChartDimensions = () => {
    const width = 800
    const height = 300
    const padding = { top: 40, right: 40, bottom: 60, left: 60 }
    
    return { width, height, padding }
  }

  const getScales = () => {
    if (moodData.length === 0) return { 
      xScale: () => 0, 
      yScale: () => 0, 
      dates: [], 
      maxCount: 0,
      chartWidth: 0,
      chartHeight: 0
    }
    
    const { width, height, padding } = getChartDimensions()
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    
    // Handle case where there's only one date
    const dates = [...new Set(moodData.map(d => d.date))].sort()
    const maxCount = Math.max(...moodData.map(d => d.count), 1) // Ensure at least 1
    
    const xScale = (date: string) => {
      if (dates.length <= 1) return chartWidth / 2 // Center if only one date
      const index = dates.indexOf(date)
      return (index / (dates.length - 1)) * chartWidth
    }
    
    const yScale = (count: number) => {
      if (maxCount <= 1) return chartHeight / 2 // Center if max count is 1 or less
      return chartHeight - (count / maxCount) * chartHeight
    }
    
    return { xScale, yScale, dates, maxCount, chartWidth, chartHeight }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className={`${theme.card} rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  const { width, height, padding } = getChartDimensions()
  const { xScale, yScale, dates, maxCount } = getScales()

  // Don't render chart if there's no data
  if (moodData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.card} rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${theme.text}`}>Mood Timeline</h3>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
        
        <div className="text-center py-12">
          <p className={theme.accent}>No mood data available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Start creating thoughts with moods to see your emotional patterns!</p>
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            {Object.entries(moodConfig).map(([mood, config]) => (
              <div key={mood} className="flex items-center space-x-1">
                <span>{config.emoji}</span>
                <span className="text-xs capitalize text-gray-600">{mood}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.card} rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme.text}`}>Mood Timeline</h3>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>

      <div className="relative">
        {/* Chart SVG */}
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" />
          
          {/* Y-axis labels */}
          {maxCount > 0 && Array.from({ length: Math.min(maxCount + 1, 10) }, (_, i) => {
            const value = Math.floor((maxCount / Math.min(maxCount, 9)) * (maxCount - i))
            return (
              <g key={i}>
                <text
                  x={padding.left - 10}
                  y={padding.top + yScale(value) + 5}
                  textAnchor="end"
                  className="text-xs fill-current"
                  style={{ color: theme.accent.replace('text-', '') }}
                >
                  {value}
                </text>
                <line
                  x1={padding.left}
                  y1={padding.top + yScale(value)}
                  x2={width - padding.right}
                  y2={padding.top + yScale(value)}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              </g>
            )
          })}
          
          {/* X-axis labels */}
          {dates.length > 0 && dates.filter((_, i) => i % Math.max(1, Math.floor(dates.length / 10)) === 0).map((date, i) => (
            <text
              key={date}
              x={padding.left + (xScale(date) || 0)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-xs fill-current"
              style={{ color: theme.accent.replace('text-', '') }}
            >
              {formatDate(date)}
            </text>
          ))}
          
          {/* Data points */}
          {moodData.map((point, index) => {
            const x = padding.left + (xScale(point.date) || 0)
            const y = padding.top + (yScale(point.count) || 0)
            const isHovered = hoveredPoint === point
            const isSelected = selectedPoint === point
            
            // Skip rendering if coordinates are invalid
            if (isNaN(x) || isNaN(y)) return null
            
            return (
              <motion.g key={`${point.date}-${point.mood}`}>
                {/* Glow effect for hovered/selected points */}
                {(isHovered || isSelected) && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill={point.color}
                    opacity={0.2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
                
                {/* Main data point */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={Math.max(4, Math.min(8, point.count * 2))}
                  fill={point.color}
                  className="cursor-pointer"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isHovered ? 1.2 : 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{ scale: 1.3 }}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setSelectedPoint(selectedPoint === point ? null : point)}
                />
                
                {/* Emoji overlay */}
                <text
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  className="text-xs pointer-events-none select-none"
                  style={{ fontSize: isHovered ? '10px' : '8px' }}
                >
                  {point.emoji}
                </text>
              </motion.g>
            )
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bg-white shadow-lg rounded-lg p-3 border pointer-events-none z-10"
            style={{
              left: padding.left + (xScale(hoveredPoint.date) || 0) + 10,
              top: padding.top + (yScale(hoveredPoint.count) || 0) - 10,
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{hoveredPoint.emoji}</span>
              <div>
                <div className="font-medium capitalize">{hoveredPoint.mood}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(hoveredPoint.date)} • {hoveredPoint.count} thought{hoveredPoint.count > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          {Object.entries(moodConfig).map(([mood, config]) => (
            <div key={mood} className="flex items-center space-x-1">
              <span>{config.emoji}</span>
              <span className="text-xs capitalize text-gray-600">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}