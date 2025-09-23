'use client'

import { useEffect, useState } from 'react'

interface ResponsiveTypographyProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTypography({ children, className = '' }: ResponsiveTypographyProps) {
  const [fontSize, setFontSize] = useState('text-base')
  const [userPreference, setUserPreference] = useState<'small' | 'medium' | 'large'>('medium')

  useEffect(() => {
    // Load user preference from localStorage
    const saved = localStorage.getItem('typography-preference')
    if (saved && ['small', 'medium', 'large'].includes(saved)) {
      setUserPreference(saved as 'small' | 'medium' | 'large')
    }
  }, [])

  useEffect(() => {
    // Apply font size based on preference
    const sizeMap = {
      small: 'text-sm',
      medium: 'text-base', 
      large: 'text-lg'
    }
    setFontSize(sizeMap[userPreference])
    
    // Save preference
    localStorage.setItem('typography-preference', userPreference)
  }, [userPreference])

  return (
    <div className={`${fontSize} ${className}`}>
      {children}
    </div>
  )
}

// Typography controls component
export function TypographyControls() {
  const [userPreference, setUserPreference] = useState<'small' | 'medium' | 'large'>('medium')

  useEffect(() => {
    const saved = localStorage.getItem('typography-preference')
    if (saved && ['small', 'medium', 'large'].includes(saved)) {
      setUserPreference(saved as 'small' | 'medium' | 'large')
    }
  }, [])

  const handleChange = (size: 'small' | 'medium' | 'large') => {
    setUserPreference(size)
    localStorage.setItem('typography-preference', size)
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('typography-change', { detail: size }))
  }

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Text Size:</span>
      <div className="flex space-x-1">
        {[
          { value: 'small', label: 'A', size: 'text-xs' },
          { value: 'medium', label: 'A', size: 'text-sm' },
          { value: 'large', label: 'A', size: 'text-base' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange(option.value as 'small' | 'medium' | 'large')}
            className={`
              w-8 h-8 rounded-md flex items-center justify-center font-semibold transition-all
              ${option.value === userPreference
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
              ${option.size}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}