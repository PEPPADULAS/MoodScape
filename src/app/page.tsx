'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/theme-context'
import { ThemeName } from '@/lib/themes'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, currentTheme, setTheme } = useTheme()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  const handleSeasonClick = (seasonKey: string) => {
    // Set theme to the selected season (uses light mode for front page)
    setTheme(seasonKey as ThemeName)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out ${theme.background}`}>
      {/* Header */}
      <header className="relative z-10">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">{theme.emoji}</span>
            <span className={`text-xl font-bold ${theme.text}`}>MoodScape</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/about"
              className={`${theme.text} hover:opacity-75 transition-opacity`}
            >
              About
            </Link>
            <Link
              href="/auth/signin"
              className={`${theme.text} hover:opacity-75 transition-opacity`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className={`${theme.button} text-white px-4 py-2 rounded-lg transition-colors`}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-4xl font-bold tracking-tight ${theme.text} sm:text-6xl`}
            >
              Capture Your Thoughts Through
              <span className={`block bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                Every Season
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`mt-6 text-lg leading-8 ${theme.accent} max-w-2xl mx-auto`}
            >
              A beautiful, responsive journal that adapts to the seasons and your moods.
              Organize your daily experiences, thoughts, and memories with automatic 
              seasonal themes that change with nature's rhythm.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                href="/auth/signup"
                className={`${theme.button} text-white px-6 py-3 text-sm font-semibold rounded-lg shadow-sm transition-colors`}
              >
                Start Your Journey
              </Link>
              <Link
                href="/auth/signin"
                className={`text-sm font-semibold leading-6 ${theme.text} hover:opacity-75 transition-opacity`}
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto max-w-6xl">
          
          {/* Current Theme Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="text-center mb-8"
          >
            <p className={`text-sm ${theme.accent} mb-2`}>Experience different seasonal moods</p>
            <div className={`inline-flex items-center space-x-2 ${theme.card} rounded-full px-4 py-2`}>
              <span className="text-lg">{theme.emoji}</span>
              <span className={`text-sm font-medium ${theme.text}`}>
                Current: {theme.name}
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                emoji: '🌸',
                title: 'Spring',
                description: 'Fresh beginnings and new growth',
                themeKey: 'spring'
              },
              {
                emoji: '☀️',
                title: 'Summer',
                description: 'Vibrant energy and warm memories',
                themeKey: 'summer'
              },
              {
                emoji: '🍂',
                title: 'Fall',
                description: 'Reflection and golden moments',
                themeKey: 'fall'
              },
              {
                emoji: '❄️',
                title: 'Winter',
                description: 'Peaceful contemplation and rest',
                themeKey: 'winter'
              },
              {
                emoji: '🌧️',
                title: 'Rainy',
                description: 'Cozy moments and gentle rhythms',
                themeKey: 'rainy'
              }
            ].map((season, index) => (
              <motion.div
                key={season.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className={`${theme.card} rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  currentTheme.includes(season.themeKey) 
                    ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' 
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => handleSeasonClick(season.themeKey)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-4">{season.emoji}</div>
                <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>{season.title}</h3>
                <p className={`text-sm ${theme.accent}`}>{season.description}</p>
                <div className={`mt-3 text-xs ${
                  currentTheme.includes(season.themeKey) 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {currentTheme.includes(season.themeKey) ? 'Current theme' : 'Click to preview theme'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
