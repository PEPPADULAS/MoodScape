'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, Filter, Download } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface ActivityData {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
  thoughts: Array<{ id: string; title?: string; mood?: string }>;
}

interface ActivityHeatmapProps {
  className?: string;
  thoughts?: Array<{ 
    id: string; 
    title?: string; 
    content: string; 
    mood?: string; 
    createdAt: string; 
  }>;
}

export function ActivityHeatmap({ className, thoughts = [] }: ActivityHeatmapProps) {
  const { theme } = useTheme();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [selectedCell, setSelectedCell] = useState<ActivityData | null>(null);
  const [hoveredCell, setHoveredCell] = useState<ActivityData | null>(null);
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (thoughts.length > 0) {
      generateActivityData();
    } else {
      setActivityData([]);
      setLoading(false);
    }
  }, [thoughts, viewMode, currentDate]);

  const generateActivityData = () => {
    setLoading(true);
    
    const activityMap: Record<string, ActivityData> = {};
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    
    if (viewMode === 'year') {
      startDate.setFullYear(currentDate.getFullYear(), 0, 1);
      endDate.setFullYear(currentDate.getFullYear(), 11, 31);
    } else {
      startDate.setDate(1);
      endDate.setMonth(currentDate.getMonth() + 1, 0);
    }

    // Initialize all dates with zero activity
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      activityMap[dateStr] = {
        date: dateStr,
        count: 0,
        level: 0,
        thoughts: []
      };
    }

    // Process thoughts data
    thoughts.forEach(thought => {
      const date = new Date(thought.createdAt).toISOString().split('T')[0];
      if (activityMap[date]) {
        activityMap[date].count++;
        activityMap[date].thoughts.push({
          id: thought.id,
          title: thought.title,
          mood: thought.mood
        });
      }
    });

    // Calculate intensity levels
    const counts = Object.values(activityMap).map(d => d.count);
    const maxCount = Math.max(...counts);
    
    Object.values(activityMap).forEach(data => {
      if (maxCount > 0) {
        data.level = Math.min(4, Math.floor((data.count / maxCount) * 4));
      }
    });

    setActivityData(Object.values(activityMap));
    setLoading(false);
  };



  const getIntensityColor = (level: number) => {
    const season = theme.emoji;
    
    switch (season) {
      case '🌸': // Spring
        const springColors = ['#f0f9f0', '#c6f6d5', '#68d391', '#38a169', '#2f855a'];
        return springColors[level];
      case '☀️': // Summer
        const summerColors = ['#fffbeb', '#fed7aa', '#fdba74', '#f97316', '#ea580c'];
        return summerColors[level];
      case '🍂': // Fall
        const fallColors = ['#fef3c7', '#fde68a', '#fbbf24', '#d97706', '#b45309'];
        return fallColors[level];
      case '❄️': // Winter
        const winterColors = ['#f0f9ff', '#bae6fd', '#7dd3fc', '#0ea5e9', '#0284c7'];
        return winterColors[level];
      case '🌧️': // Rainy
        const rainyColors = ['#f8fafc', '#cbd5e1', '#94a3b8', '#64748b', '#475569'];
        return rainyColors[level];
      default:
        const defaultColors = ['#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'];
        return defaultColors[level];
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeeksInYear = (year: number) => {
    const weeks: Date[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Find the first Sunday of the year
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    let currentWeek: Date[] = [];
    for (let d = new Date(firstSunday); d <= endDate; d.setDate(d.getDate() + 1)) {
      currentWeek.push(new Date(d));
      
      if (d.getDay() === 6 || d >= endDate) { // Saturday or last day
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    return weeks;
  };

  const renderYearView = () => {
    const weeks = getWeeksInYear(currentDate.getFullYear());
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-4">
        {/* Month labels */}
        <div className="grid grid-cols-12 gap-1 text-xs text-center">
          {monthLabels.map((month, index) => (
            <div key={month} className={theme.accent}>
              {month}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="space-y-1">
          {/* Day labels */}
          <div className="grid grid-cols-1 gap-1 text-xs">
            {dayLabels.map((day, index) => (
              index % 2 === 1 && (
                <div key={day} className={`${theme.accent} text-right pr-2`}>
                  {day}
                </div>
              )
            ))}
          </div>

          {/* Activity cells */}
          <div className="grid grid-cols-53 gap-1">
            {weeks.map((week, weekIndex) =>
              week.map((date, dayIndex) => {
                const dateStr = date.toISOString().split('T')[0];
                const activity = activityData.find(d => d.date === dateStr);
                const isCurrentYear = date.getFullYear() === currentDate.getFullYear();
                
                if (!isCurrentYear) return null;

                return (
                  <motion.div
                    key={dateStr}
                    className="w-3 h-3 rounded-sm cursor-pointer border border-gray-200/20"
                    style={{ 
                      backgroundColor: activity ? getIntensityColor(activity.level) : getIntensityColor(0) 
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onHoverStart={() => setHoveredCell(activity || null)}
                    onHoverEnd={() => setHoveredCell(null)}
                    onClick={() => setSelectedCell(activity || null)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    for (let d = new Date(startDate); d <= monthEnd || currentWeek.length < 7; d.setDate(d.getDate() + 1)) {
      currentWeek.push(new Date(d));
      
      if (d.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-4">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 text-sm text-center">
          {dayLabels.map(day => (
            <div key={day} className={theme.accent}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((date, dayIndex) => {
                const dateStr = date.toISOString().split('T')[0];
                const activity = activityData.find(d => d.date === dateStr);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                
                return (
                  <motion.div
                    key={dateStr}
                    className={`w-12 h-12 rounded-lg cursor-pointer border flex items-center justify-center text-sm font-medium ${
                      isCurrentMonth ? 'border-gray-200/20' : 'border-gray-200/10'
                    }`}
                    style={{ 
                      backgroundColor: activity ? getIntensityColor(activity.level) : getIntensityColor(0),
                      opacity: isCurrentMonth ? 1 : 0.3
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setHoveredCell(activity || null)}
                    onHoverEnd={() => setHoveredCell(null)}
                    onClick={() => setSelectedCell(activity || null)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isCurrentMonth ? 1 : 0.3 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.05 }}
                  >
                    <span className={isCurrentMonth ? theme.text : 'text-gray-400'}>
                      {date.getDate()}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const downloadData = () => {
    const csv = activityData.map(d => 
      `${d.date},${d.count},${d.level}`
    ).join('\n');
    
    const blob = new Blob([`Date,Count,Level\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'activity-heatmap.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.card} rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${theme.text}`}>Activity Heatmap</h3>
          <p className={`text-sm ${theme.accent}`}>Your writing patterns over time</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1">
            {['year', 'month'].map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {mode}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            onClick={downloadData}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className={`w-4 h-4 ${theme.accent}`} />
          </motion.button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={() => {
            const newDate = new Date(currentDate);
            if (viewMode === 'year') {
              newDate.setFullYear(newDate.getFullYear() - 1);
            } else {
              newDate.setMonth(newDate.getMonth() - 1);
            }
            setCurrentDate(newDate);
          }}
          className={`px-3 py-1 rounded-lg ${theme.accent} hover:bg-white/10 transition-colors`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Previous
        </motion.button>
        
        <h4 className={`text-lg font-medium ${theme.text}`}>
          {viewMode === 'year' 
            ? currentDate.getFullYear()
            : currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
          }
        </h4>
        
        <motion.button
          onClick={() => {
            const newDate = new Date(currentDate);
            if (viewMode === 'year') {
              newDate.setFullYear(newDate.getFullYear() + 1);
            } else {
              newDate.setMonth(newDate.getMonth() + 1);
            }
            setCurrentDate(newDate);
          }}
          className={`px-3 py-1 rounded-lg ${theme.accent} hover:bg-white/10 transition-colors`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next →
        </motion.button>
      </div>

      {/* Heatmap */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="mb-6">
          {viewMode === 'year' ? renderYearView() : renderMonthView()}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className={theme.accent}>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getIntensityColor(level) }}
              />
            ))}
          </div>
          <span className={theme.accent}>More</span>
        </div>
        
        <div className={`text-sm ${theme.accent}`}>
          {activityData.filter(d => d.count > 0).length} active days
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 bg-black/90 backdrop-blur-md rounded-lg p-3 pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-white text-sm">
              <div className="font-medium">{formatDate(hoveredCell.date)}</div>
              <div className="text-white/60">
                {hoveredCell.count} thought{hoveredCell.count !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-white/5 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${theme.text}`}>
                {formatDate(selectedCell.date)}
              </h4>
              <motion.button
                onClick={() => setSelectedCell(null)}
                className="text-white/60 hover:text-white/80"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
            
            {selectedCell.thoughts.length > 0 ? (
              <div className="space-y-2">
                {selectedCell.thoughts.map((thought, index) => (
                  <motion.div
                    key={thought.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-white/5 rounded-md"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className={`flex-1 ${theme.text}`}>
                      {thought.title || 'Untitled Thought'}
                    </span>
                    {thought.mood && (
                      <span className={`text-xs px-2 py-1 bg-white/10 rounded-full ${theme.accent}`}>
                        {thought.mood}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={theme.accent}>No thoughts recorded on this day.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}